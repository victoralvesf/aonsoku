import { useState } from 'react'

interface CoverArtProps {
  url?: string
  size: number
}

export function CoverArt({ url, size }: CoverArtProps) {
  const [failed, setFailed] = useState(false)

  const style = { width: size, height: size }

  if (!url || failed) {
    return (
      <div
        className="shrink-0 rounded-lg"
        style={{ ...style, background: 'var(--w-track)' }}
      />
    )
  }

  return (
    <img
      src={url}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-lg object-cover"
      style={style}
    />
  )
}
