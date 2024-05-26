import { ReactNode } from "react";

export default function ListWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full px-4 py-6 lg:px-8 pt-0">
      {children}
    </div>
  )
}