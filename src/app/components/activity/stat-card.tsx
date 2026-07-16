import { ElementType } from 'react'
import { Card } from '@/app/components/ui/card'

interface StatCardProps {
  icon: ElementType
  value: string
  label: string
  hint?: string
}

export function StatCard({ icon: Icon, value, label, hint }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <Icon className="mb-1 h-5 w-5 text-primary" />
      <span className="text-2xl font-bold leading-tight">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
    </Card>
  )
}
