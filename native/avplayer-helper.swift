import AVFoundation
import AVKit
import AppKit
import Foundation

// ─── Per-backend player state ─────────────────────────────────────────────────

// Class (not struct) so closures can mutate fields like endEmitted directly.
final class PlayerState {
  var player: AVPlayer
  var timeObserver: Any?
  var endObserver: NSObjectProtocol?
  var statusObservation: NSKeyValueObservation?
  var timeControlObservation: NSKeyValueObservation?
  var endEmitted = false

  init(player: AVPlayer) { self.player = player }
}

var states: [String: PlayerState] = [:]

// ─── AirPlay picker ───────────────────────────────────────────────────────────

var airplayPicker: AVRoutePickerView?
var airplayPanel: NSPanel?
var airplayPickerIsOpen = false
var airplayLastDismissed: Date = .distantPast

func clickPickerButton() {
  guard let picker = airplayPicker else { return }
  func click(_ v: NSView) {
    if let btn = v as? NSButton { btn.performClick(nil); return }
    v.subviews.forEach { click($0) }
  }
  click(picker)
}

class RoutePickerDelegate: NSObject, AVRoutePickerViewDelegate {
  func routePickerViewDidEndPresentingRoutes(_ routePickerView: AVRoutePickerView) {
    airplayPickerIsOpen = false
    airplayLastDismissed = Date()
  }
}

var routePickerDelegate: RoutePickerDelegate?

func setupAirPlayPicker() {
  let size: CGFloat = 44
  let picker = AVRoutePickerView(frame: NSRect(x: 0, y: 0, width: size, height: size))
  let delegate = RoutePickerDelegate()
  routePickerDelegate = delegate
  picker.delegate = delegate

  let panel = NSPanel(
    contentRect: NSRect(x: -size * 2, y: -size * 2, width: size, height: size),
    styleMask: [.nonactivatingPanel],
    backing: .buffered,
    defer: false
  )
  panel.isOpaque = false
  panel.backgroundColor = .clear
  panel.alphaValue = 0
  panel.level = .popUpMenu
  panel.ignoresMouseEvents = true
  panel.contentView = picker
  panel.orderFrontRegardless()

  airplayPicker = picker
  airplayPanel = panel
}

// ─── stdout event emission ────────────────────────────────────────────────────

func emit(_ dict: [String: Any]) {
  guard let data = try? JSONSerialization.data(withJSONObject: dict, options: []),
    let line = String(data: data, encoding: .utf8)
  else { return }
  print(line)
  fflush(stdout)
}

func log(_ message: String) {
  fputs("[avplayer-helper] \(message)\n", stderr)
  fflush(stderr)
}

// ─── Per-backend cleanup ──────────────────────────────────────────────────────

func teardown(id: String) {
  guard let state = states[id] else { return }
  // Deactivate observations before pausing so no play/pause events leak out
  // during teardown (e.g., when load() replaces a currently-playing item).
  state.timeControlObservation = nil
  state.statusObservation = nil
  if let obs = state.timeObserver {
    state.player.removeTimeObserver(obs)
  }
  if let obs = state.endObserver {
    NotificationCenter.default.removeObserver(obs)
  }
  state.player.pause()
  states.removeValue(forKey: id)
}

// ─── Command dispatch ─────────────────────────────────────────────────────────

func handle(_ cmd: [String: Any]) {
  guard let type = cmd["type"] as? String else {
    log("ignoring command with missing type: \(cmd)")
    return
  }

  // showAirPlay is not tied to a player instance — handle before the id guard.
  if type == "showAirPlay" {
    guard let x = cmd["x"] as? Double,
          let y = cmd["y"] as? Double,
          let height = cmd["height"] as? Double,
          let screen = NSScreen.main,
          let panel = airplayPanel else { return }

    if airplayPickerIsOpen {
      // Toggle: click again to dismiss the open popover.
      clickPickerButton()
      return
    }

    // The popover dismisses on mouse-down when the user clicks the button while
    // it's open. The React onClick fires on mouse-up, arriving here shortly after.
    // Ignore that trailing click so we don't immediately reopen the picker.
    if Date().timeIntervalSince(airplayLastDismissed) < 0.3 { return }

    let size: CGFloat = 44
    let panelX = CGFloat(x) - size / 2
    let panelY = screen.frame.height - CGFloat(y) - CGFloat(height) / 2 - size / 2
    panel.setFrameOrigin(NSPoint(x: panelX, y: panelY))
    airplayPickerIsOpen = true

    // Brief delay so the panel finishes repositioning before the click.
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
      clickPickerButton()
    }
    return
  }

  guard let id = cmd["id"] as? String else {
    log("ignoring command with missing id: \(cmd)")
    return
  }

  switch type {

  case "load":
    guard let urlStr = cmd["url"] as? String else {
      log("load: url key missing or not a string")
      emit(["type": "error", "id": id, "message": "Missing URL"])
      return
    }
    guard let url = URL(string: urlStr) else {
      log("load: URL(string:) returned nil for: \(urlStr)")
      emit(["type": "error", "id": id, "message": "Invalid URL: \(urlStr)"])
      return
    }

    log("load: url=\(urlStr)")
    teardown(id: id)

    let item = AVPlayerItem(url: url)
    let player = AVPlayer(playerItem: item)
    player.allowsExternalPlayback = true
    let state = PlayerState(player: player)

    emit(["type": "loadstart", "id": id])

    state.statusObservation = item.observe(\.status, options: [.new]) { observedItem, _ in
      switch observedItem.status {
      case .readyToPlay:
        let secs = CMTimeGetSeconds(observedItem.duration)
        log("readyToPlay: duration=\(secs) id=\(id)")
        if secs.isFinite && secs > 0 {
          emit(["type": "loadedmetadata", "id": id, "duration": secs])
        }
      case .failed:
        let msg = observedItem.error?.localizedDescription ?? "Playback failed"
        log("KVO failed: \(msg)")
        emit(["type": "error", "id": id, "message": msg])
      default:
        break
      }
    }

    // Drive play/pause events from actual player state rather than echoing
    // commands. This correctly handles system-triggered pauses (audio focus
    // loss, Bluetooth disconnect) and avoids false events from rapid toggling.
    // .waitingToPlayAtSpecifiedRate means buffering — not a play/pause transition.
    state.timeControlObservation = player.observe(\.timeControlStatus, options: [.new]) { _, change in
      switch change.newValue {
      case .playing:
        emit(["type": "play", "id": id])
      case .paused:
        emit(["type": "pause", "id": id])
      default:
        break
      }
    }

    // Periodic time updates (every 0.5 s).
    // Also the fallback end detector: if the HTTP stream doesn't close cleanly,
    // AVFoundation may never fire AVPlayerItemDidPlayToEndTime. Detect end by
    // time proximity instead (within 0.5 s of duration while playing).
    let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    state.timeObserver = player.addPeriodicTimeObserver(
      forInterval: interval, queue: .main
    ) { [weak player, weak state] time in
      let secs = CMTimeGetSeconds(time)
      guard secs.isFinite else { return }
      emit(["type": "timeupdate", "id": id, "time": secs])
      guard let s = state, !s.endEmitted,
            let p = player,
            p.timeControlStatus == .playing,
            let dur = p.currentItem.map({ CMTimeGetSeconds($0.duration) }),
            dur.isFinite && dur > 0 && secs >= dur - 0.5 else { return }
      s.endEmitted = true
      emit(["type": "ended", "id": id])
    }

    // Primary end notification — fires when HTTP response closes cleanly.
    state.endObserver = NotificationCenter.default.addObserver(
      forName: .AVPlayerItemDidPlayToEndTime, object: item, queue: .main
    ) { [weak state] _ in
      guard let s = state, !s.endEmitted else { return }
      s.endEmitted = true
      emit(["type": "ended", "id": id])
    }

    states[id] = state

  case "play":
    states[id]?.player.play()

  case "pause":
    states[id]?.player.pause()

  case "seek":
    guard let seconds = cmd["seconds"] as? Double else { return }
    let time = CMTime(seconds: seconds, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    states[id]?.player.seek(to: time, toleranceBefore: .zero, toleranceAfter: .zero)

  case "setVolume":
    guard let value = cmd["value"] as? Float else { return }
    states[id]?.player.volume = max(0, min(1, value))

  case "setRate":
    guard let rate = cmd["rate"] as? Float else { return }
    states[id]?.player.rate = rate

  case "destroy":
    teardown(id: id)

  default:
    break
  }
}

// ─── stdin command reader ─────────────────────────────────────────────────────

var inputBuffer = Data()

// Initialize NSApplication so AppKit (AVRoutePickerView, NSPanel) works.
// .accessory = no Dock icon, no menu bar entry.
NSApplication.shared.setActivationPolicy(.accessory)

// Close all file descriptors inherited from the parent (Electron/Chromium opens
// many IPC sockets and Mach ports that can interfere with AVFoundation's own
// XPC/networking channels). Keep only stdin(0), stdout(1), stderr(2).
do {
  var closedCount = 0
  for fd in Int32(3)..<Int32(1024) {
    if fcntl(fd, F_GETFD) >= 0 {
      close(fd)
      closedCount += 1
    }
  }
  if closedCount > 0 {
    log("closed \(closedCount) inherited fds")
  }
}

log("avplayer-helper started")

setupAirPlayPicker()

FileHandle.standardInput.readabilityHandler = { fh in
  let chunk = fh.availableData
  guard !chunk.isEmpty else {
    log("stdin closed, exiting")
    DispatchQueue.main.async { exit(0) }
    return
  }

  // Dispatch to main so AVPlayer is created/used on the main thread, where
  // NSApplication.run() is active and AVFoundation callbacks can be delivered.
  DispatchQueue.main.async {
    inputBuffer.append(chunk)

    while let newline = inputBuffer.firstIndex(of: UInt8(ascii: "\n")) {
      let lineData = inputBuffer[inputBuffer.startIndex..<newline]
      inputBuffer = inputBuffer[inputBuffer.index(after: newline)...]

      if let json = try? JSONSerialization.jsonObject(with: lineData) as? [String: Any] {
        handle(json)
      } else if !lineData.isEmpty {
        log("failed to parse JSON: \(String(data: lineData, encoding: .utf8) ?? "<non-utf8>")")
      }
    }
  }
}

NSApplication.shared.run()
