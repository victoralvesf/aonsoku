import { useEffect, useState } from 'react'
import { WidgetNowPlayingPayload } from '@/types/widget'

const POSITION_TICK_MS = 250

export function useNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<WidgetNowPlayingPayload | null>(
    null,
  )

  useEffect(() => {
    let disposed = false

    // Initial paint before the stream is up. Ignored if an event already
    // arrived, so a stale snapshot can never overwrite a fresher one.
    fetch('/widget/now-playing')
      .then((response) => response.json())
      .then((data: WidgetNowPlayingPayload | null) => {
        if (disposed || !data) return
        setNowPlaying((current) => current ?? data)
      })
      .catch(() => {})

    const source = new EventSource('/widget/events')

    source.onmessage = (event) => {
      try {
        setNowPlaying(JSON.parse(event.data) as WidgetNowPlayingPayload)
      } catch {}
    }

    return () => {
      disposed = true
      source.close()
    }
  }, [])

  return nowPlaying
}

export function useInterpolatedPosition(
  nowPlaying: WidgetNowPlayingPayload | null,
) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!nowPlaying) {
      setPosition(0)
      return
    }

    const { position: base, updatedAt, duration, isPlaying } = nowPlaying

    const update = () => {
      const elapsed = isPlaying ? (Date.now() - updatedAt) / 1000 : 0
      const next = base + elapsed

      setPosition(duration > 0 ? Math.min(next, duration) : next)
    }

    update()

    if (!isPlaying) return

    const interval = setInterval(update, POSITION_TICK_MS)

    return () => clearInterval(interval)
  }, [nowPlaying])

  return position
}
