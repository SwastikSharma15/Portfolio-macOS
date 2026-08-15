"use client"

import { Radio, Play } from "lucide-react"

export function RadioView() {
  return (
    <div className="h-full overflow-auto">
      <div className="px-4 pt-4 pb-4">
        <h1 className="text-2xl font-bold">Radio</h1>
      </div>

      {/* Featured Radio */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <h2 className="text-sm font-medium mb-2">FEATURED STATION</h2>
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-lg mr-4 bg-purple-400 flex items-center justify-center">
              <Radio className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Today's Hits</h3>
              <p className="text-sm text-white/80">The biggest hits right now</p>
              <button className="mt-2 bg-white text-purple-500 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Play className="h-3 w-3" /> Listen Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Radio Stations */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold mb-3">Popular Stations</h2>
        <div className="space-y-3">
          {[
            { name: "Hip-Hop Beats", description: "Latest hip-hop tracks", color: "bg-red-500" },
            { name: "Chill Lounge", description: "Relaxing ambient music", color: "bg-blue-500" },
            { name: "Workout Mix", description: "High energy for your workout", color: "bg-green-500" },
            { name: "Classic Rock", description: "Timeless rock hits", color: "bg-yellow-500" },
            { name: "Jazz Cafe", description: "Smooth jazz selections", color: "bg-indigo-500" },
          ].map((station, index) => (
            <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className={`w-12 h-12 rounded-lg mr-3 ${station.color} flex items-center justify-center`}>
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{station.name}</h3>
                <p className="text-xs text-gray-500">{station.description}</p>
              </div>
              <Play className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-20">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Pop", "Rock", "Electronic", "Hip-Hop", "R&B", "Country", "Jazz", "Classical"].map((category) => (
            <div
              key={category}
              className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white font-bold"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
