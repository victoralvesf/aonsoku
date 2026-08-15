import { readFile } from 'node:fs/promises'
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http'
import { join, normalize, sep } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { widgetState } from './widgetState'
import {
  isValidWidgetPort,
  type WidgetProfile,
  type WidgetServerStatus,
} from './widgetTypes'

const HOST = '127.0.0.1'
const SSE_HEARTBEAT_MS = 15_000

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
}

// In dev the renderer is served by the Vite dev server, so assets are proxied
// from it. In production they are read from the built renderer output.
const devServerUrl = process.env.ELECTRON_RENDERER_URL
const useDevServer = is.dev && Boolean(devServerUrl)
const rendererDir = join(__dirname, '../renderer')

let server: Server | null = null

const sseClients = new Set<ServerResponse>()

type ProfileResolver = (id: string) => WidgetProfile | undefined
type StatusListener = (status: WidgetServerStatus) => void

let resolveProfile: ProfileResolver = () => undefined
let onStatusChange: StatusListener = () => {}

export function setWidgetServerHooks(hooks: {
  resolveProfile: ProfileResolver
  onStatusChange: StatusListener
}) {
  resolveProfile = hooks.resolveProfile
  onStatusChange = hooks.onStatusChange
}

function mimeTypeFor(pathname: string) {
  const dotIndex = pathname.lastIndexOf('.')
  if (dotIndex === -1) return 'application/octet-stream'

  return (
    MIME_TYPES[pathname.slice(dotIndex).toLowerCase()] ??
    'application/octet-stream'
  )
}

function errorPage(title: string, message: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        display: flex; align-items: center; justify-content: center;
        background: #12151c; color: #e7e9ee;
        font: 14px/1.5 system-ui, -apple-system, sans-serif;
        text-align: center; padding: 24px; box-sizing: border-box;
      }
      strong { display: block; margin-bottom: 8px; font-size: 16px; }
      span { color: #9aa1b1; max-width: 420px; display: block; }
    </style>
  </head>
  <body>
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  </body>
</html>`
}

function sendHtml(res: ServerResponse, html: string, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(html)
}

function sendJson(res: ServerResponse, body: unknown, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

async function readWidgetShell() {
  if (useDevServer) {
    const response = await fetch(`${devServerUrl}/widget.html`)
    if (!response.ok) {
      throw new Error(`Dev server returned ${response.status}`)
    }
    return await response.text()
  }

  const html = await readFile(join(rendererDir, 'widget.html'), 'utf-8')

  // electron-vite builds the renderer with a relative base ('./'), but the
  // widget page is served from /widget/profile/:id, where relative asset paths
  // would resolve one level too deep. Assets are served from the server root,
  // so make those references absolute.
  return html.replace(/(src|href)="\.\//g, '$1="/')
}

function injectProfileConfig(html: string, profile: WidgetProfile) {
  // `<` is escaped so a profile name can never break out of the script tag.
  const json = JSON.stringify(profile).replace(/</g, '\\u003c')
  const tag = `<script>window.__WIDGET_PROFILE__ = ${json};</script>`

  if (html.includes('</head>')) {
    return html.replace('</head>', `  ${tag}\n  </head>`)
  }

  return `${tag}${html}`
}

async function handleProfilePage(res: ServerResponse, id: string) {
  const profile = resolveProfile(id)

  if (!profile) {
    sendHtml(
      res,
      errorPage(
        'Widget not found',
        'This widget profile no longer exists. Open Aonsoku → Settings → Widget and copy the URL again.',
      ),
      404,
    )
    return
  }

  try {
    const shell = await readWidgetShell()
    sendHtml(res, injectProfileConfig(shell, profile))
  } catch (error) {
    console.error('[WidgetServer] Unable to load the widget page.', error)
    sendHtml(
      res,
      errorPage(
        'Widget unavailable',
        'Aonsoku could not load the widget page. Restart the app and try again.',
      ),
      500,
    )
  }
}

async function handleAsset(res: ServerResponse, pathname: string) {
  if (useDevServer) {
    try {
      const response = await fetch(`${devServerUrl}${pathname}`)

      if (!response.ok || !response.body) {
        res.writeHead(response.status).end()
        return
      }

      res.writeHead(200, {
        'Content-Type':
          response.headers.get('content-type') ?? mimeTypeFor(pathname),
        'Cache-Control': 'no-store',
      })
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch {
      res.writeHead(502).end()
    }
    return
  }

  // Resolve inside the renderer output only — never escape it.
  const relative = normalize(decodeURIComponent(pathname)).replace(
    /^(\.\.[/\\])+/,
    '',
  )
  const filePath = join(rendererDir, relative)

  if (!filePath.startsWith(rendererDir + sep)) {
    res.writeHead(403).end()
    return
  }

  try {
    const file = await readFile(filePath)

    res.writeHead(200, {
      'Content-Type': mimeTypeFor(filePath),
      'Cache-Control': 'no-store',
    })
    res.end(file)
  } catch {
    res.writeHead(404).end()
  }
}

function handleEvents(res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  })

  // Node keeps the headers queued until the first body write, which would
  // leave EventSource unopened until the first heartbeat. Push them out now
  // and tell the client how fast to reconnect when the server is toggled off
  // and on again.
  res.flushHeaders()
  res.write('retry: 2000\n\n')

  // The stream is long-lived by design; the default socket timeout would
  // otherwise tear it down mid-broadcast.
  res.setTimeout(0)

  sseClients.add(res)

  const snapshot = widgetState.get()
  if (snapshot) {
    res.write(`data: ${JSON.stringify(snapshot)}\n\n`)
  }

  const heartbeat = setInterval(() => {
    res.write(': ping\n\n')
  }, SSE_HEARTBEAT_MS)

  res.on('close', () => {
    clearInterval(heartbeat)
    sseClients.delete(res)
  })
}

// Subscribing here (instead of broadcasting from the IPC handler) keeps the
// snapshot served by /widget/now-playing and the one pushed over SSE from ever
// drifting apart: there is a single write path into widgetState.
widgetState.subscribe((payload) => {
  if (sseClients.size === 0) return

  const message = `data: ${JSON.stringify(payload)}\n\n`

  sseClients.forEach((client) => {
    try {
      client.write(message)
    } catch {
      sseClients.delete(client)
    }
  })
})

function closeSseClients() {
  sseClients.forEach((client) => {
    try {
      client.end()
    } catch {}
  })
  sseClients.clear()
}

const PROFILE_ROUTE = /^\/widget\/profile\/([\w-]+)\/?$/

// The async handlers own their expected failures; this is the last resort so a
// surprise rejection closes the socket instead of leaving OBS hanging.
function settle(res: ServerResponse, handler: Promise<void>) {
  handler.catch((error) => {
    console.error('[WidgetServer] Unhandled request failure.', error)

    if (!res.headersSent) res.writeHead(500)
    res.end()
  })
}

function createRequestHandler() {
  return (req: IncomingMessage, res: ServerResponse) => {
    const { pathname } = new URL(req.url ?? '/', `http://${HOST}`)

    if (req.method !== 'GET') {
      res.writeHead(405).end()
      return
    }

    if (pathname === '/widget/events') {
      handleEvents(res)
      return
    }

    if (pathname === '/widget/now-playing') {
      sendJson(res, widgetState.get() ?? null)
      return
    }

    const profileMatch = PROFILE_ROUTE.exec(pathname)
    if (profileMatch) {
      settle(res, handleProfilePage(res, profileMatch[1]))
      return
    }

    if (pathname === '/' || pathname === '/widget' || pathname === '/widget/') {
      sendHtml(
        res,
        errorPage(
          'Aonsoku widget server',
          'Nothing to show here. Use the profile URL copied from Aonsoku → Settings → Widget.',
        ),
        404,
      )
      return
    }

    settle(res, handleAsset(res, pathname))
  }
}

export function stopWidgetServer(): Promise<void> {
  return new Promise((resolve) => {
    closeSseClients()

    if (!server) {
      resolve()
      return
    }

    const instance = server
    server = null

    instance.close(() => resolve())
    // Sockets kept alive by SSE are already closed above; this only guards
    // against a hung keep-alive connection delaying the restart.
    instance.closeAllConnections?.()
  })
}

export async function startWidgetServer(port: number): Promise<void> {
  await stopWidgetServer()

  if (!isValidWidgetPort(port)) {
    onStatusChange({
      status: 'error',
      port,
      code: 'invalid-port',
      message: `Port ${port} is not allowed.`,
    })
    return
  }

  const instance = createServer(createRequestHandler())

  instance.on('error', (error: NodeJS.ErrnoException) => {
    server = null

    const code = error.code === 'EADDRINUSE' ? 'port-in-use' : 'unknown'

    console.error('[WidgetServer] Failed to start.', error)

    onStatusChange({
      status: 'error',
      port,
      code,
      message: error.message,
    })
  })

  instance.listen(port, HOST, () => {
    server = instance

    onStatusChange({ status: 'running', port })
  })
}
