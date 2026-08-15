import type React from "react"
interface IPhoneFrameProps {
  children?: React.ReactNode
  className?: string
}

export function IPhoneFrame({ children, className = "" }: IPhoneFrameProps) {
  return (
    <div className="relative w-full max-w-[375px] aspect-[375/812] mx-auto">
      {/* iPhone outer frame */}
      <div className="absolute inset-0 rounded-[45px] bg-black shadow-lg z-20">
        {/* Inner frame with border */}
        <div className="absolute inset-[3px] rounded-[42px] bg-white overflow-hidden">
          {/* Screen bezel */}
          <div className="absolute inset-0 border-[8px] border-black rounded-[34px] overflow-hidden z-10">
            {/* Dynamic Island (pill) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[126px] h-[34px] bg-black rounded-[20px] z-50 mt-2" />

            {/* Content area */}
            <div className="w-full h-full rounded-[26px] overflow-hidden">{children}</div>
          </div>
        </div>

        {/* Side buttons */}
        {/* Volume up */}
        <div className="absolute left-[-2px] top-[100px] w-[4px] h-[40px] bg-[#121212] rounded-l-sm" />

        {/* Volume down */}
        <div className="absolute left-[-2px] top-[160px] w-[4px] h-[40px] bg-[#121212] rounded-l-sm" />

        {/* Power button */}
        <div className="absolute right-[-2px] top-[120px] w-[4px] h-[100px] bg-[#121212] rounded-r-sm" />
      </div>
    </div>
  )
}
