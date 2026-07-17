import * as http from 'node:http'
import type { AddressInfo } from 'node:net'
import { net } from 'electron'

let server: http.Server | null = null
let proxyPort = 0

// id → original URL
const streams = new Map<string, string>()

// Hop-by-hop headers must not be forwarded between proxy hops. Forwarding
// transfer-encoding in particular confuses AVFoundation because Node has
// already decoded chunked upstream data before we re-send it.
const HOP_BY_HOP = new Set([
  'transfer-encoding',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
])

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  // Strip query string — the ?t= cache-buster is only for AVFoundation's URL cache
  const id = (req.url?.split('?')[0] ?? '').replace(/^\//, '')
  const url = streams.get(id)

  if (!url) {
    res.writeHead(404)
    res.end()
    return
  }

  const headers: Record<string, string> = {}
  if (req.headers.range) headers.Range = req.headers.range as string

  const upstream = net.request({ url, method: 'GET', headers })

  upstream.on('response', (upRes) => {
    const forwardHeaders: Record<string, string | string[]> = {}
    for (const [k, v] of Object.entries(upRes.headers)) {
      if (v !== undefined && !HOP_BY_HOP.has(k.toLowerCase())) {
        forwardHeaders[k] = v as string | string[]
      }
    }
    // Tell AVFoundation the connection closes after this response.
    // Without this, the keep-alive connection stays open and AVFoundation
    // treats the stream as a live/infinite source, never firing
    // AVPlayerItemDidPlayToEndTime.
    forwardHeaders.connection = 'close'
    res.writeHead(upRes.statusCode ?? 200, forwardHeaders)

    let done = false
    upRes.on('data', (chunk: Buffer) => res.write(chunk))
    upRes.on('end', () => {
      done = true
      res.end()
    })
    upRes.on('error', (err) => {
      // Ignore errors after the response completes — these are harmless abort
      // signals from req.on('close') cleaning up an already-finished upstream.
      if (!done) {
        console.error('[AVPlayerProxy] upstream error:', err.message)
        res.destroy()
      }
    })
  })

  upstream.on('error', (err) => {
    console.error('[AVPlayerProxy] request error:', err.message)
    if (!res.headersSent) res.writeHead(502)
    res.end()
  })

  req.on('close', () => upstream.abort())
  upstream.end()
}

export function startAvPlayerProxy(): Promise<number> {
  if (server) return Promise.resolve(proxyPort)

  return new Promise((resolve, reject) => {
    server = http.createServer(handleRequest)
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      proxyPort = (server!.address() as AddressInfo).port
      console.log('[AVPlayerProxy] listening on port', proxyPort)
      resolve(proxyPort)
    })
  })
}

export function stopAvPlayerProxy() {
  server?.close()
  server = null
  proxyPort = 0
  streams.clear()
}

export function registerProxyStream(id: string, url: string): string {
  streams.set(id, url)
  // The ?t= cache-buster ensures AVFoundation doesn't reuse a cached response
  // from a previous song that happened to use the same player id.
  return `http://127.0.0.1:${proxyPort}/${id}?t=${Date.now()}`
}

export function unregisterProxyStream(id: string) {
  streams.delete(id)
}
