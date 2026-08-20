"use client";

import { Play, MoreHorizontal, Music2 } from "lucide-react";
import useAudioStore from "@/store/audio";
import { songs } from "@/constants";

export function HomeView() {
  const { setIndex, history, playlist } = useAudioStore();
  const allSongs = playlist.length > 0 ? playlist : songs;

  const FEATURED_ALBUMS = [
    {
      id: "1",
      title: songs[9]?.title,
      artist: songs[9]?.author,
      artwork: songs[9]?.cover,
      index: 9,
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
    },
  ];

  return (
    <div className="h-full overflow-y-auto pb-24 select-none">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Listen Now</h1>

        {/* Featured Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Picks For You</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {FEATURED_ALBUMS.map((album) => (
              <div
                key={album.id}
                className="min-w-[200px] snap-start cursor-pointer group"
                onClick={() => setIndex(album.index)}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 relative group-hover:scale-[1.02] transition-transform">
                  <img
                    src={album.artwork || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm truncate">{album.title}</h3>
                <p className="text-xs text-gray-500 truncate">{album.artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played (Only shown if songs have actually been played) */}
        {history.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((song) => {
                const realIndex = allSongs.findIndex((s) => s.id === song.id);
                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                    onClick={() => setIndex(realIndex !== -1 ? realIndex : 0)}
                  >
                    <img
                      src={song.cover || "/placeholder.svg"}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{song.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{song.author}</p>
                    </div>
                    <button className="text-gray-400">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Library Songs (All Songs) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Music2 className="w-5 h-5 text-red-500" />
              Library Songs
            </h2>
            <span className="text-xs font-medium text-gray-500">{allSongs.length} Songs</span>
          </div>

          <div className="space-y-3">
            {allSongs.map((song, index) => (
              <div
                key={song.id || index}
                className="flex items-center gap-3 p-2 hover:bg-gray-100/80 rounded-xl cursor-pointer transition-colors group"
                onClick={() => setIndex(index)}
              >
                <img
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate group-hover:text-red-500 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{song.author}</p>
                </div>
                <button type="button" className="p-2 text-gray-400 hover:text-red-500">
                  <Play className="h-4 w-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
