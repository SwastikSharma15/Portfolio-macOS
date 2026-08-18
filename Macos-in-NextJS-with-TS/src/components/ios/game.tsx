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
    <div className="h-full w-full bg-white flex flex-col text-black font-sans relative overflow-hidden pt-10">
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 flex flex-col bg-white"
          >
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-12 left-4 z-[70] w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <iframe
              src={selectedGame.url}
              className="w-full h-full border-none flex-1 pointer-events-auto select-auto"
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
