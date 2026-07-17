import { ChildProcess, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { platform } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain } from 'electron'
import {
  AvPlayerCommandPayload,
  AvPlayerEventPayload,
  IpcChannels,
} from '../../preload/types'
import {
  registerProxyStream,
  startAvPlayerProxy,
  stopAvPlayerProxy,
  unregisterProxyStream,
} from './avPlayerProxy'

let helperProcess: ChildProcess | null = null

function getHelperPath(): string {
  const binaryName = 'avplayer-helper'
  if (process.env.NODE_ENV === 'development') {
    return join(app.getAppPath(), 'native', binaryName)
  }
  return join(process.resourcesPath, binaryName)
}

function sendToHelper(payload: object) {
  if (!helperProcess?.stdin) {
    console.warn(
      '[AVPlayerBridge] sendToHelper: no helper process stdin',
      payload,
    )
    return
  }
  helperProcess.stdin.write(JSON.stringify(payload) + '\n')
}

export async function initAvPlayerBridge(window: BrowserWindow) {
  if (!platform.isMacOS) {
    console.log('[AVPlayerBridge] skipping — not macOS')
    return
  }
  if (helperProcess) {
    console.warn(
      '[AVPlayerBridge] initAvPlayerBridge called while already initialized — ignoring',
    )
    return
  }

  const helperPath = getHelperPath()
  console.log(
    '[AVPlayerBridge] helper path:',
    helperPath,
    'exists:',
    existsSync(helperPath),
  )

  if (!existsSync(helperPath)) {
    console.warn(
      '[AVPlayerBridge] helper binary not found — run pnpm build:native:mac',
    )
    return
  }

  // Start local HTTP proxy — Electron's subprocess can't make direct outgoing
  // HTTPS requests on macOS, but can connect to localhost. The proxy uses
  // Electron's net module to fetch the actual stream and serves it locally.
  const port = await startAvPlayerProxy()
  console.log('[AVPlayerBridge] proxy started on port', port)

  // Minimal environment — passing the full process.env leaks Electron/Chromium
  // IPC socket paths and Mach port variables that interfere with AVFoundation's
  // own XPC and networking channels inside the subprocess.
  const env: NodeJS.ProcessEnv = {
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR,
    USER: process.env.USER,
    PATH: process.env.PATH || '/usr/bin:/bin:/usr/sbin:/sbin',
  }

  helperProcess = spawn(helperPath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env,
  })
  console.log('[AVPlayerBridge] helper spawned, pid:', helperProcess.pid)

  let lineBuffer = ''
  // stdout is non-null: we spawned with stdio: ['pipe', 'pipe', 'pipe']
  helperProcess.stdout!.setEncoding('utf8')
  helperProcess.stdout!.on('data', (chunk: string) => {
    lineBuffer += chunk
    const lines = lineBuffer.split('\n')
    lineBuffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const event = JSON.parse(line) as AvPlayerEventPayload
        if (!window.isDestroyed()) {
          window.webContents.send(IpcChannels.AvPlayerEvent, event)
        }
      } catch {
        console.warn('[AVPlayerBridge] malformed line from helper:', line)
      }
    }
  })

  helperProcess.stderr!.setEncoding('utf8')
  helperProcess.stderr!.on('data', (chunk: string) => {
    console.log('[avplayer-helper]', chunk.trim())
  })

  helperProcess.on('exit', (code, signal) => {
    console.log(
      '[AVPlayerBridge] helper exited — code:',
      code,
      'signal:',
      signal,
    )
    helperProcess = null
  })

  helperProcess.on('error', (err) => {
    console.error('[AVPlayerBridge] helper spawn error:', err)
  })

  ipcMain.on(
    IpcChannels.AvPlayerCommand,
    (_, payload: AvPlayerCommandPayload) => {
      if (payload.type === 'load') {
        // Replace the remote URL with a proxy localhost URL so the helper can
        // reach the stream (direct HTTPS from the subprocess is blocked by macOS).
        const proxyUrl = registerProxyStream(payload.id, payload.url)
        sendToHelper({ ...payload, url: proxyUrl })
      } else {
        if (payload.type === 'destroy') unregisterProxyStream(payload.id)
        sendToHelper(payload)
      }
    },
  )

  console.log('[AVPlayerBridge] ready')
}

export function destroyAvPlayerBridge() {
  ipcMain.removeAllListeners(IpcChannels.AvPlayerCommand)
  if (helperProcess) {
    helperProcess.kill()
    helperProcess = null
  }
  stopAvPlayerProxy()
}
