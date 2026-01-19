import { Row } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { ISong } from '@/types/responses/song'

export function QueueReorderButton({ row }: { row: Row<ISong> }) {
  return (
    <Button
      variant="ghost"
      className="w-8 h-8 p-1 rounded-full hover:bg-background hover:shadow-sm cursor-grab active:cursor-grabbing"
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation()
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(row.index))
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <GripVertical className="w-5 h-5" />
    </Button>
  )
}
