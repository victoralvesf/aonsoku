import { ReactNode } from "react";

export function ShadowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-start px-8 py-4 sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-b-2 -shadow-spread-2">
      {children}
    </div>
  )
}