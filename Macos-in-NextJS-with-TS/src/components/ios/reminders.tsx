"use client"
import { useState } from "react"
import { Search, Plus, Calendar, Clock, Inbox, CheckCircle2, Circle } from "lucide-react"

export function Reminders() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish portfolio redesign", completed: true },
    { id: 2, text: "Push changes to GitHub", completed: false },
    { id: 3, text: "Update resume with new skills", completed: false },
    { id: 4, text: "Email recruiter back", completed: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  return (
    <div className="h-full w-full bg-[#f2f2f7] flex flex-col pt-10">
      <div className="px-4 mb-4">
        <div className="flex justify-end mb-2 text-blue-500 font-medium">Edit</div>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-2 top-1.5" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#e3e3e8] rounded-xl pl-9 pr-4 py-1.5 outline-none text-[15px]"
          />
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</span>
          </div>
          <div className="text-gray-500 font-medium">Today</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">0</span>
          </div>
          <div className="text-gray-500 font-medium">Scheduled</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm col-span-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-white">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-gray-500 font-medium">All</span>
          </div>
          <span className="text-2xl font-bold text-gray-400">{tasks.length}</span>
        </div>
      </div>

      <div className="flex-1 px-4">
        <h2 className="text-2xl font-bold mb-3">My Lists</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {tasks.map((task, idx) => (
            <div key={task.id} className="flex items-center p-3 border-b border-gray-100 last:border-0">
              <button onClick={() => toggleTask(task.id)} className="mr-3">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </button>
              <span className={`text-[15px] ${task.completed ? "text-gray-400 line-through" : "text-black"}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 flex justify-between items-center text-blue-500 font-medium">
        <button className="flex items-center gap-1">
          <Plus className="w-5 h-5" />
          <span>New Reminder</span>
        </button>
        <button>Add List</button>
      </div>
    </div>
  )
}
