import { useEffect, useState } from 'react'
import { GenericSlider } from './generic-slider'

interface SteppedSliderProps {
  steps: number[]
  value: number
  onStepChange: (step: number) => void
}

export function SteppedSlider({
  steps,
  value,
  onStepChange,
}: SteppedSliderProps) {
  const [currentStep, setCurrentStep] = useState(value)

  // Keeps up with changes made outside of the slider
  useEffect(() => {
    setCurrentStep(value)
  }, [value])

  const MIN = steps[0]
  const MAX = steps[steps.length - 1]

  const percentOf = (value: number) => (value - MIN) / (MAX - MIN)

  const snapToStep = (value: number) =>
    steps.reduce((closest, step) =>
      Math.abs(step - value) < Math.abs(closest - value) ? step : closest,
    )

  const changeStep = (step: number) => {
    setCurrentStep(step)
    onStepChange(step)
  }

  const setByIndex = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), steps.length - 1)
    changeStep(steps[clamped])
  }

  // Without this, the slider stops responding to keyboard input
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const index = steps.indexOf(currentStep)
    let next: number

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = index + 1
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = index - 1
        break
      case 'PageUp':
        next = index + 2
        break
      case 'PageDown':
        next = index - 2
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = steps.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    setByIndex(next)
  }

  return (
    // --thumb needs to be set with real size of the slider thumb, in our case is 1rem.
    <div className="flex flex-col w-full max-w-full gap-1 relative [--thumb:1rem]">
      <div className="relative h-8">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            tabIndex={-1}
            data-status={step === currentStep ? 'active' : 'inactive'}
            onClick={() => changeStep(step)}
            className="group absolute top-0 flex flex-col items-center gap-1 -translate-x-1/2 outline-none focus-visible:outline-none"
            style={{
              left: `calc(var(--thumb) / 2 + (100% - var(--thumb)) * ${percentOf(step)})`,
            }}
          >
            <span className="text-sm tabular-nums text-muted-foreground group-data-[status=active]:text-primary">
              {step}
            </span>
            <div className="w-0.5 h-[30px] bg-secondary group-data-[status=active]:bg-primary" />
          </button>
        ))}
      </div>

      <GenericSlider
        value={[currentStep]}
        onValueChange={([value]) => setCurrentStep(snapToStep(value))}
        onValueCommit={([value]) => onStepChange(snapToStep(value))}
        onKeyDown={handleKeyDown}
        min={MIN}
        max={MAX}
        step={1}
        aria-valuetext={`${currentStep}%`}
      />
    </div>
  )
}
