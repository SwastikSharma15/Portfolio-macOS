"use client"
import { useState, useEffect } from "react"
import { Globe, AlarmClock, Timer, Hourglass } from "lucide-react"

export function Clock() {
  const [time, setTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("world")

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const tabs = [
    { id: "world", icon: Globe, label: "World Clock" },
    { id: "alarm", icon: AlarmClock, label: "Alarm" },
    { id: "stopwatch", icon: Timer, label: "Stopwatch" },
    { id: "timer", icon: Hourglass, label: "Timer" },
  ]

  return (
    <div className="h-full w-full bg-black text-white flex flex-col pt-10">
      <div className="flex-1 px-4">
        {activeTab === "world" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">World Clock</h1>
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
              <div>
                <div className="text-gray-400 text-sm">Today, +0HRS</div>
                <div className="text-xl">Cupertino</div>
              </div>
              <div className="text-4xl font-light">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "alarm" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Alarm</h1>
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
              <div>
                <div className="text-5xl font-light mb-1">07:00 <span className="text-2xl">AM</span></div>
                <div className="text-gray-400 text-sm">Wake Up</div>
              </div>
              <div className="w-12 h-7 bg-green-500 rounded-full relative">
                <div className="w-6 h-6 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stopwatch" && (
          <div className="flex flex-col items-center justify-center h-full pt-20">
            <div className="text-7xl font-light mb-16 font-mono">
              00:00.00
            </div>
            <div className="flex gap-20 w-full px-8">
              <button className="w-20 h-20 rounded-full bg-gray-800 text-white font-medium border-2 border-gray-800">Lap</button>
              <button className="w-20 h-20 rounded-full bg-green-900 text-green-500 font-medium border-2 border-green-900">Start</button>
            </div>
          </div>
        )}
        
        {activeTab === "timer" && (
          <div className="flex flex-col items-center justify-center h-full pt-20">
             <div className="flex justify-center gap-4 text-4xl font-light mb-16">
               <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4">
                 <span>00</span>
                 <span className="text-sm text-gray-400">hours</span>
               </div>
               <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4">
                 <span>15</span>
                 <span className="text-sm text-gray-400">min</span>
               </div>
               <div className="flex flex-col items-center bg-gray-800 rounded-lg p-4">
                 <span>00</span>
                 <span className="text-sm text-gray-400">sec</span>
               </div>
             </div>
             <div className="flex gap-20 w-full px-8">
              <button className="w-20 h-20 rounded-full bg-gray-800 text-white font-medium border-2 border-gray-800">Cancel</button>
              <button className="w-20 h-20 rounded-full bg-green-900 text-green-500 font-medium border-2 border-green-900">Start</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-around items-center py-2 border-t border-gray-900 bg-black pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 ${isActive ? "text-orange-500" : "text-gray-500"}`}>
              <Icon className="w-6 h-6" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
