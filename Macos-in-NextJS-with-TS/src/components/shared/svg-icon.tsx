import Image from "next/image"
import type { HTMLAttributes } from "react"

interface SVGIconProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: number
}

export function SVGIcon({ name, size = 40, className, ...props }: SVGIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }} {...props}>
      <Image src={`/icons/${name}.svg`} alt={`${name} icon`} width={size} height={size} className="w-full h-full" />
    </div>
  )
}
