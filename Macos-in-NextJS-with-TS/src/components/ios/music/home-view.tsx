"use client"

import { Play, MoreHorizontal } from "lucide-react"
import useAudioStore from "@/store/audio"
import { songs } from "@/constants"

export function HomeView() {
  const { setIndex, history, playlist } = useAudioStore()
  // Use history if available, otherwise fallback to first 5 songs
  const recentSongs = history.length > 0 ? history.slice(0, 5) : playlist.slice(0, 5)
  const FEATURED_ALBUMS = [
    {
      id: "1",
      title: songs[0]?.title,
      artist: songs[0]?.author,
      artwork: songs[0]?.cover,
      index: 0,
    },
    {
      id: "2",
      title: songs[2]?.title,
      artist: songs[2]?.author,
      artwork: songs[2]?.cover,
      index: 2,
    },
    {
      id: "3",
      title: songs[4]?.title,
      artist: songs[4]?.author,
      artwork: songs[4]?.cover,
      index: 4,
    }
  ]

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Listen Now</h1>

        {/* Featured Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Picks For You</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {FEATURED_ALBUMS.map((album) => (
              <div
                key={album.id}
                className="min-w-[200px] snap-start cursor-pointer"
                onClick={() => setIndex(album.index)}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 relative group">
                  <img src={album.artwork || "/placeholder.svg"} alt={album.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium text-sm truncate">{album.title}</h3>
                <p className="text-xs text-gray-500 truncate">{album.artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
          <div className="space-y-3">
            {recentSongs.map((song) => {
              const realIndex = playlist.findIndex(s => s.id === song.id)
              return (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setIndex(realIndex !== -1 ? realIndex : 0)}
                >
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{song.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{song.author}</p>
                  </div>
                  <button className="text-gray-400">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
