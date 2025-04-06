import { SingleAlbum } from '@/types/responses/album'
import { RECORD_LABELS_MAX_NUMBER } from '@/utils/multipleArtists'

type RecordLabelsInfoProps = {
  album: SingleAlbum
}

export function RecordLabelsInfo({ album }: RecordLabelsInfoProps) {
  if (!album.recordLabels) return null
  if (album.recordLabels.length === 0) return null

  const labels = album.recordLabels.slice(0, RECORD_LABELS_MAX_NUMBER)

  return (
    <div className="w-full mt-8 text-muted-foreground text-[0.6875rem] font-normal">
      {labels.map((label) => (
        <p key={label.name}>{`℗ ${album.year} ${label.name}`}</p>
      ))}
    </div>
  )
}
