import { SingleAlbum } from '@/types/responses/album'

type RecordLabelsInfoProps = {
  album: SingleAlbum
}

export function RecordLabelsInfo({ album }: RecordLabelsInfoProps) {
  if (!album.recordLabels) return null
  if (album.recordLabels.length === 0) return null

  const labels = album.recordLabels.slice(0, 3)

  return (
    <div className="w-full mt-8 text-muted-foreground text-sm">
      {labels.map((label) => (
        <small key={label.name}>
          {'©'} {album.year} {label.name}
        </small>
      ))}
    </div>
  )
}
