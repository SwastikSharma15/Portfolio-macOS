"use client"

import type React from "react"
import { useState } from "react"
import { Search, MoreVertical, Plus } from "lucide-react"
import { songs } from "@/constants"
import useAudioStore from "@/store/audio"

export function SearchView() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<typeof songs>([])
  const { setIndex, isPlaying, play } = useAudioStore()
  const [showOptions, setShowOptions] = useState<number | null>(null)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setResults(
        songs.filter(
          (song) =>
            song.title.toLowerCase().includes(value.toLowerCase()) ||
            song.author.toLowerCase().includes(value.toLowerCase()),
        ),
      )
    } else {
      setResults([])
    }
  }

  const handleSongClick = (index: number) => {
    // Find the original index of the song in the constants array
    const originalIndex = songs.findIndex(s => s.id === results[index].id)
    if (originalIndex !== -1) {
      setIndex(originalIndex)
      if (!isPlaying) {
        setTimeout(() => play(), 100)
      }
    }
  }

  return (
    <div className="h-full overflow-auto pb-24">
      <div className="px-4 pt-4 pb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-9 bg-gray-100 rounded-lg pl-9 pr-4 text-sm outline-none"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {query && results.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">No results found for "{query}"</div>
      )}

      {results.length > 0 && (
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-3">Songs</h2>
          <div className="space-y-2">
            {results.map((song, i) => (
              <div key={song.id} className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer relative">
                <img
                  src={song.cover || "/placeholder.svg?height=48&width=48"}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg mr-3 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
                <div className="flex-1" onClick={() => handleSongClick(i)}>
                  <h3 className="font-medium text-sm truncate">{song.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{song.author}</p>
                </div>
                <button
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowOptions(showOptions === song.id ? null : song.id)
                  }}
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-3">All Songs</h2>
          <div className="space-y-2">
            {songs.map((song, i) => (
              <div key={song.id} className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer relative">
                <img
                  src={song.cover || "/placeholder.svg?height=48&width=48"}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg mr-3 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
                <div className="flex-1" onClick={() => handleSongClick(i)}>
                  <h3 className="font-medium text-sm truncate">{song.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{song.author}</p>
                </div>
                <button
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowOptions(showOptions === song.id ? null : song.id)
                  }}
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
