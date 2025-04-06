import { ComponentPropsWithoutRef } from 'react'

type ResizeHandlerProps = ComponentPropsWithoutRef<'div'>

export function ResizeHandler({ ...props }: ResizeHandlerProps) {
  return (
    <div {...props}>
      <div className="relative w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-rotate-45 absolute"
          style={{ top: 2 }}
        >
          <path d="M5 12h14" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-rotate-45 absolute"
          style={{
            top: 7,
            left: 2,
          }}
        >
          <path d="M5 12h14" />
        </svg>
      </div>
    </div>
  )
}
