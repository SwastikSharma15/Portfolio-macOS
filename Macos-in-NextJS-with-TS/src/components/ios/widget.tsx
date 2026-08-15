import type React from "react"
import type { ReactNode } from "react"

interface WidgetProps {
  title: string
  content: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function Widget({ title, content, className = "", onClick }: WidgetProps) {
  return (
    <div className="flex flex-col select-none group cursor-pointer" onClick={onClick}>
      <div className={`ios26-widget p-4 ${className}`}>{content}</div>
      <div className="text-[13px] text-white mt-1.5 text-center ios26-text-glow font-medium drop-shadow-md">{title}</div>
    </div>
  )
}
