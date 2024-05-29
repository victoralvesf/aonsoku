import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ListWrapperProps {
  children: ReactNode
  className?: string
}

export default function ListWrapper({ children, className }: ListWrapperProps) {
  return (
    <div className={cn("w-full px-4 py-6 lg:px-8 pt-0", className)}>
      {children}
    </div>
  )
}