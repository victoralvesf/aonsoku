import { Badge } from '@/app/components/ui/badge'

interface HeaderTitleProps {
  title: string
  count?: number
}

export function HeaderTitle({ title, count }: HeaderTitleProps) {
  return (
    <div className="flex gap-2 items-center">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="text-foreground/70">
          {count}
        </Badge>
      )}
    </div>
  )
}
