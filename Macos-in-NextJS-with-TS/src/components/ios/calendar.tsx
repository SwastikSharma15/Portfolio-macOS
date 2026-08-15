"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

// Meaningful developer/portfolio-themed events
const EVENTS = [
  {
    title: "Team Standup",
    time: "9:30 AM - 9:45 AM",
    color: "orange",
    description: "Daily sync with the dev team",
  },
  {
    title: "Code Interview Prep",
    time: "2:00 PM - 3:30 PM",
    color: "blue",
    description: "Practice DSA problems on LeetCode",
  },
  {
    title: "Open Source Contrib",
    time: "4:00 PM - 5:00 PM",
    color: "green",
    description: "Work on Next.js PR review",
  },
  {
    title: "Design System Update",
    time: "11:30 AM - 12:30 PM",
    color: "purple",
    description: "Update component library tokens",
  },
]

const TOMORROW_EVENTS = [
  {
    title: "Client Presentation",
    time: "10:00 AM - 11:00 AM",
    color: "indigo",
    description: "Present project progress to stakeholders",
  },
  {
    title: "Coffee Chat with Mentor",
    time: "3:00 PM - 3:30 PM",
    color: "amber",
    description: "Career advice session",
  },
]

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; textLight: string }> = {
  red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", textLight: "text-red-500" },
  blue: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", textLight: "text-blue-500" },
  orange: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700", textLight: "text-orange-500" },
  green: { bg: "bg-green-50", border: "border-green-500", text: "text-green-700", textLight: "text-green-500" },
  purple: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700", textLight: "text-purple-500" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-500", text: "text-indigo-700", textLight: "text-indigo-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", textLight: "text-amber-500" },
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  // Check if viewing current month
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

  const renderDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && isCurrentMonth
      // Show dots on days with events (simulate: today and tomorrow)
      const hasEvent = isCurrentMonth && (i === today.getDate() || i === today.getDate() + 1)
      days.push(
        <div key={i} className="h-10 flex flex-col items-center justify-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? "bg-red-500 text-white" : "text-black"}`}>
            {i}
          </div>
          {hasEvent && !isToday && (
            <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5" />
          )}
        </div>
      )
    }
    return days
  }

  return (
    <div className="h-full w-full bg-white flex flex-col pt-10">
      <div className="flex justify-between items-center px-4 mb-4 text-red-500">
        <div className="flex gap-4">
          <Search className="w-6 h-6" />
        </div>
        <Plus className="w-6 h-6" />
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1"><ChevronLeft className="text-red-500" /></button>
            <button onClick={nextMonth} className="p-1"><ChevronRight className="text-red-500" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
          {dayNames.map((day, idx) => <div key={idx}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {renderDays()}
        </div>
      </div>

      {/* Events Section */}
      <div className="mt-3 flex-1 border-t border-gray-200 overflow-y-auto">
        {/* Today's Events */}
        <div className="p-4 pb-2">
          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-right w-14">
              <div className="text-2xl font-semibold text-black">{today.getDate()}</div>
              <div className="text-[11px] text-gray-400 uppercase font-medium">Today</div>
            </div>
            <div className="flex-1 space-y-2">
              {EVENTS.map((event, idx) => {
                const colors = COLOR_MAP[event.color] || COLOR_MAP.red
                return (
                  <div key={idx} className={`${colors.bg} border-l-4 ${colors.border} p-2.5 rounded-r-lg`}>
                    <div className={`font-semibold ${colors.text} text-sm`}>{event.title}</div>
                    <div className={`text-xs ${colors.textLight} mt-0.5`}>{event.time}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tomorrow's Events */}
        <div className="px-4 pb-4">
          <div className="flex items-baseline gap-3">
            <div className="text-right w-14">
              <div className="text-2xl font-semibold text-gray-400">{today.getDate() + 1}</div>
              <div className="text-[11px] text-gray-400 uppercase font-medium">Tomorrow</div>
            </div>
            <div className="flex-1 space-y-2">
              {TOMORROW_EVENTS.map((event, idx) => {
                const colors = COLOR_MAP[event.color] || COLOR_MAP.blue
                return (
                  <div key={idx} className={`${colors.bg} border-l-4 ${colors.border} p-2.5 rounded-r-lg`}>
                    <div className={`font-semibold ${colors.text} text-sm`}>{event.title}</div>
                    <div className={`text-xs ${colors.textLight} mt-0.5`}>{event.time}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 text-red-500 text-sm font-medium">
        <button>Today</button>
        <button>Calendars</button>
        <button>Inbox</button>
      </div>
    </div>
  )
}
