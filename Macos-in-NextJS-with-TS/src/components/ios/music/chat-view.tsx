"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import useAudioStore from "@/store/audio"

// Define ChatMessage interface locally since it might be expecting old Song format
interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: number
  currentSong?: any
}

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "MusicBot",
      content: "Hello 👋 I'm your music assistant. What would you like to listen to today?",
      timestamp: Date.now() - 1000 * 60 * 5,
    },
  ])
  const [input, setInput] = useState("")
  const { playlist, currentIndex } = useAudioStore()
  const currentSong = playlist?.[currentIndex]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "you",
      content: input,
      timestamp: Date.now(),
      currentSong,
    }

    setMessages([...messages, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "MusicBot",
        content: getBotResponse(input),
        timestamp: Date.now(),
        currentSong,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("play") || lowerMessage.includes("listen")) {
      return "I've found some great music for you! Check out the featured albums on the Home tab."
    }

    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
      return "Based on your listening history, I think you might enjoy some Anime or Gaming soundtracks. Check out the Search tab!"
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hi there! How can I help with your music needs today?"
    }

    return "I'm here to help you discover and enjoy music. You can ask me to play songs, recommend music, or help you find new artists!"
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-4 border-b">
        <h1 className="text-lg font-semibold">Music Assistant</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 pb-24">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.sender === "you" ? "bg-red-500 text-white" : "bg-gray-100"
                }`}
            >
              {message.sender !== "you" && <div className="text-sm text-gray-500 mb-1">{message.sender}</div>}
              <p className="text-sm">{message.content}</p>
              {message.currentSong && (
                <div className="mt-2 text-xs bg-black/10 p-2 rounded-lg">
                  🎵 {message.currentSong.title} - {message.currentSong.author}
                </div>
              )}
              <div
                className={`text-xs mt-1 text-right ${message.sender === "you" ? "text-white/70" : "text-gray-500"}`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t mb-20 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about music..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
