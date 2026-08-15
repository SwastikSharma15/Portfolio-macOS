"use client"
import { X, List } from "lucide-react"
import useAudioStore from "@/store/audio"

interface QueueViewProps {
  isOpen: boolean
  onClose: () => void
}

export function QueueView({ isOpen, onClose }: QueueViewProps) {
  const { playlist, currentIndex, setIndex } = useAudioStore()

  if (!isOpen) return null

  const currentSong = playlist?.[currentIndex]
  const queue = playlist?.slice(currentIndex + 1) || []

  const handleSongClick = (originalIndex: number) => {
    setIndex(originalIndex, { autoplay: true })
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={onClose}>
          <X className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-lg font-semibold">Up Next</h1>
        <div className="w-6"></div> {/* Empty div for alignment */}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Currently Playing */}
        {currentSong && (
          <div className="mb-6">
            <h2 className="text-sm text-gray-500 mb-2">Now Playing</h2>
            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
              <img
                src={currentSong.cover || "/placeholder.svg?height=48&width=48"}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg mr-3 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                }}
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm truncate">{currentSong.title}</h3>
                <p className="text-xs text-gray-500 truncate">{currentSong.author}</p>
              </div>
              <List className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Queue */}
        <div>
          <h2 className="text-sm text-gray-500 mb-2">Up Next</h2>
          {queue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Your queue is empty</div>
          ) : (
            <div className="space-y-2">
              {queue.map((song, i) => (
                <div key={song.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <img
                    src={song.cover || "/placeholder.svg?height=48&width=48"}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg mr-3 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                    }}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => handleSongClick(currentIndex + 1 + i)}>
                    <h3 className="font-medium text-sm truncate">{song.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{song.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
