import { SimpleTooltip } from '../ui/simple-tooltip'
import { Switch } from '../ui/switch'

export function WidgetToggleRow({
  label,
  info,
  checked,
  onCheckedChange,
}: {
  label: string
  info?: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-8">
      <span className="text-sm text-foreground">
        {info ? (
          <SimpleTooltip text={info} delay={0}>
            <span className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-4">
              {label}
            </span>
          </SimpleTooltip>
        ) : (
          label
        )}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
