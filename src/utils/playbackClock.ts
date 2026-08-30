// The app's single high-resolution playback clock (milliseconds).
//
// Player engines publish their current position here every animation frame while
// a song plays: the standard <audio> player samples element.currentTime, and
// the gapless engine writes its Web Audio-derived position (its element is
// paused during buffer playback, so element.currentTime can't be read there).

let positionMs = 0

export const playbackClock = {
  setPositionMs(ms: number) {
    positionMs = ms
  },
  getPositionMs() {
    return positionMs
  },
  reset() {
    positionMs = 0
  },
}
