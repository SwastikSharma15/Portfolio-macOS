"use client"

import { Play, Pause, Repeat, Repeat1, Shuffle, Search, MoreHorizontal } from "lucide-react"
import useAudioStore from "@/store/audio"
import { songs } from "@/constants"

export function LibraryView() {
  const { setIndex, togglePlay, isPlaying, repeatMode, toggleRepeatMode, shuffle, toggleShuffle } = useAudioStore()
  const SAMPLE_SONGS = songs

  const getRepeatIcon = () => {
    if (repeatMode === 'repeat-one') return <Repeat1 className="h-5 w-5 fill-current" />
    return <Repeat className="h-5 w-5 fill-current" />
  }

  const getRepeatText = () => {
    if (repeatMode === 'repeat-one') return 'Repeat 1'
    if (repeatMode === 'autoplay') return 'Autoplay'
    return 'Repeat'
  }

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Library</h1>

        <div className="flex gap-4 mb-6 border-b pb-4">
          <div className="text-red-500 font-medium">Playlists</div>
          <div className="text-gray-500">Artists</div>
          <div className="text-gray-500">Albums</div>
          <div className="text-gray-500">Songs</div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button 
            className="flex-1 bg-gray-100 flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-medium"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${shuffle ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-700'}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-5 w-5" />
            Shuffle
          </button>

          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium ${repeatMode !== 'none' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-700'}`}
            onClick={toggleRepeatMode}
          >
            {getRepeatIcon()}
            {getRepeatText()}
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Find in Library"
            className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="space-y-4">
          {SAMPLE_SONGS.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => setIndex(index)}
            >
              <img
                src={song.cover || "/placeholder.svg"}
                alt={song.title}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium truncate">{song.title}</h3>
                <p className="text-sm text-gray-500 truncate">{song.author}</p>
              </div>
              <button className="text-gray-400 px-2">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
