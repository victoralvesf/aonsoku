import { ComponentPropsWithoutRef } from 'react'

type EqualizerBarsProps = ComponentPropsWithoutRef<'svg'>

export function EqualizerBars(props: EqualizerBarsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 23 23"
      className="text-foreground"
      id="bars"
      {...props}
    >
      <rect
        className="eq-bar eq-bar--1"
        x="3"
        y="4"
        width="3"
        height="8"
        fill="currentColor"
      />
      <rect
        className="eq-bar eq-bar--2"
        x="8"
        y="4"
        width="3"
        height="16"
        fill="currentColor"
      />
      <rect
        className="eq-bar eq-bar--3"
        x="13"
        y="4"
        width="3"
        height="12"
        fill="currentColor"
      />
      <rect
        className="eq-bar eq-bar--4"
        x="18"
        y="4"
        width="3"
        height="4"
        fill="currentColor"
      />
    </svg>
  )
}
