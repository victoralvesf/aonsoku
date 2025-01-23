import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Input } from './input'

interface NumericInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function NumericInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = '',
}: NumericInputProps) {
  const handleDecrement = () => {
    const newValue = value - step
    if (min === undefined || newValue >= min) {
      onChange(newValue)
    }
  }

  const handleIncrement = () => {
    const newValue = value + step
    if (max === undefined || newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div
      className={cn(
        'relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20',
        className,
      )}
    >
      <Button
        variant="outline"
        className="rounded-none rounded-l-md flex aspect-square px-2 h-[inherit] items-center justify-center"
        onClick={handleDecrement}
      >
        <Minus size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Input
        value={value}
        readOnly
        className="w-full pointer-events-none grow bg-background px-2 h-[inherit] text-center tabular-nums border-x-0 rounded-none text-foreground focus:outline-none"
      />
      <Button
        variant="outline"
        className="rounded-none rounded-r-md flex aspect-square px-2 h-[inherit] items-center justify-center"
        onClick={handleIncrement}
      >
        <Plus size={16} strokeWidth={2} aria-hidden="true" />
      </Button>
    </div>
  )
}
