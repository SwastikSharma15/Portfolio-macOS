"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Search, User, Play, ChevronLeft, Library } from "lucide-react"
import { cn } from "@/lib/utils"

const games = [
  {
    id: "slapner",
    name: "SlapNer",
    icon: "/images/slapner.png",
    url: "https://slapner.vercel.app",
    description: "Wake Ner Up",
    category: "Arcade",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "chess",
    name: "Chess",
    icon: "/images/chess.jpg",
    url: "https://chessnubot.vercel.app/",
    description: "Play chess online",
    category: "Strategy",
    banner: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "pentagoo",
    name: "PentaGo",
    icon: "/images/pEntaggo.png",
    url: "https://pentagoonline.vercel.app/",
    description: "Strategic Game",
    category: "Puzzle",
    banner: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?q=80&w=2069&auto=format&fit=crop",
  },
]

export function GameApp() {
  const [selectedGame, setSelectedGame] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"Arcade" | "Library" | "Search">("Arcade")

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (e.clientY > 100) {
        fetch('/api/log', {
          method: 'POST',
          body: JSON.stringify({
            tagName: el?.tagName,
            className: el?.className,
            id: el?.id,
            x: e.clientX,
            y: e.clientY,
            message: "Click detected in GameApp"
          })
        }).catch(console.error);
      }
    };
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  const tabs = [
    { id: "Arcade", icon: Gamepad2 },
    { id: "Library", icon: Library },
    { id: "Search", icon: Search },
  ] as const

  return (
    <div className="h-full w-full bg-white flex flex-col text-black font-sans relative overflow-hidden">
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 flex flex-col bg-white"
          >
            <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md absolute top-0 left-0 right-0 z-[60] border-b border-gray-200">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="text-lg">Games</span>
              </button>
              <div className="w-16" /> {/* Spacer */}
            </div>
            <iframe
              src={selectedGame.url}
              className="w-full h-full border-none flex-1 pointer-events-auto select-auto pt-[60px]"
              style={{
                pointerEvents: "auto",
                userSelect: "auto",
                WebkitUserSelect: "auto",
                touchAction: "auto"
              }}
              title={selectedGame.name}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Games</h1>
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-2">
        {/* Featured Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Featured</h2>
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGame(games[0])}
            className="relative w-full h-[280px] rounded-2xl overflow-hidden cursor-pointer shadow-md"
          >
            <img src={games[0].banner} alt={games[0].name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 w-full flex items-end justify-between">
              <div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">New Release</p>
                <h3 className="text-2xl font-bold text-white mb-1">{games[0].name}</h3>
                <p className="text-gray-300 text-sm">{games[0].description}</p>
              </div>
              <button className="bg-white/20 backdrop-blur-md text-white rounded-full p-3 mb-1">
                <Play className="w-5 h-5 fill-white" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* All Games Grid */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Games</h2>
            <button className="text-blue-500 text-sm font-medium">See All</button>
          </div>
          <div className="space-y-3">
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGame(game)}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer"
              >
                <img
                  src={game.icon}
                  alt={game.name}
                  className="w-[72px] h-[72px] rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[17px] leading-snug">{game.name}</h3>
                  <p className="text-gray-500 text-[13px] mt-0.5">{game.category}</p>
                </div>
                <button className="bg-gray-100 text-blue-600 font-bold px-5 py-1.5 rounded-full text-sm active:bg-gray-200 transition-colors">
                  GET
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-2 border-t bg-white relative z-10">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className="flex flex-col items-center gap-1">
            <Icon className={cn("h-6 w-6", activeTab === id ? "text-blue-500" : "text-gray-400")} />
            <span className={cn("text-xs", activeTab === id ? "text-blue-500" : "text-gray-400")}>{id}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
