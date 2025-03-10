import { Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'

export function QueueActions({ row }: { row: Row<ISong> }) {
  const { removeSongFromQueue } = usePlayerActions()

  function handleRemoveSongFromQueue() {
    removeSongFromQueue(row.original.id)
  }

  return (
    <Button
      variant="ghost"
      className="w-8 h-8 p-1 rounded-full hover:bg-background hover:shadow-sm"
      onClick={(e) => {
        e.stopPropagation()
        handleRemoveSongFromQueue()
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <XIcon className="w-5 h-5" />
    </Button>
  )
}
