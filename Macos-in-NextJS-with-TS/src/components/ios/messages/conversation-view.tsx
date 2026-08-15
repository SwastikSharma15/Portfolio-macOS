"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Video, ImageIcon, Mic, Send, X } from "lucide-react"
import { useMessagesStore } from "@/lib/messages-state"
import { generateChatResponse } from "@/lib/ai-chat"
import { formatTime } from "@/lib/utils"
import type { Message } from "@/lib/types"

const GALLERY_PHOTOS = [
  "/images/trash-1.png",
  "/images/trash-2.jpg",
  "/images/trash-4.jpg",
  "/images/trash-3.jpg",
  "/images/swastik.webp",
  "/images/gal1.webp",
]

export function ConversationView() {
  const { conversations, activeConversationId, setActiveConversation, addMessage, markAsRead } = useMessagesStore()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false)
  const [callAlert, setCallAlert] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (activeConversation) {
      scrollToBottom()
      if (activeConversation.unreadCount > 0) {
        markAsRead(activeConversation.id)
      }
    }
  }, [activeConversationId, activeConversation?.unreadCount])

  const handleSend = async (customContent?: string) => {
    const textToSend = customContent || inputValue
    if (!textToSend.trim() || !activeConversation) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: Date.now(),
      status: "sending",
    }

    addMessage(activeConversation.id, userMessage)
    if (!customContent) setInputValue("")
    setIsTyping(true)

    try {
      const response = await generateChatResponse(textToSend)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: Date.now(),
        status: "delivered",
      }
      addMessage(activeConversation.id, assistantMessage)
    } catch (error) {
      console.error("Failed to generate response:", error)
    } finally {
      setIsTyping(false)
    }
  }

  const sendPhoto = (photoUrl: string) => {
    if (!activeConversation) return
    const photoMessage: Message = {
      id: Date.now().toString(),
      content: `📷 Shared a sticker`,
      sender: "user",
      timestamp: Date.now(),
      status: "delivered",
    }
    addMessage(activeConversation.id, photoMessage)
    setIsPhotoPickerOpen(false)
  }

  const triggerFaceTime = () => {
    if (!activeConversation) return
    setCallAlert(`FaceTime call with ${activeConversation.contact.name}...`)
    setTimeout(() => setCallAlert(null), 3000)
  }

  if (!activeConversation) return null

  return (
    <div className="h-full flex flex-col bg-gray-100 text-gray-900 select-none relative">
      {/* FaceTime Notification Banner */}
      <AnimatePresence>
        {callAlert && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-14 left-4 right-4 bg-gray-900/90 text-white backdrop-blur-xl px-4 py-3 rounded-2xl z-50 flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-green-400 animate-pulse" />
              <span className="text-sm font-medium">{callAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setCallAlert(null)}
              className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold"
            >
              End
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md border-b mt-12 relative z-10">
        <button
          type="button"
          onClick={() => setActiveConversation(null)}
          className="text-blue-500 flex items-center gap-1 font-medium active:opacity-60 cursor-pointer p-1 -ml-2"
        >
          <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <div className="flex flex-col items-center">
          <img
            src={activeConversation.contact.avatar || "/images/contact.webp"}
            alt={activeConversation.contact.name}
            className="w-8 h-8 rounded-full object-cover shadow-sm"
          />
          <span className="font-semibold text-xs text-gray-900 mt-0.5">{activeConversation.contact.name}</span>
        </div>

        <button
          type="button"
          onClick={triggerFaceTime}
          className="text-blue-500 p-1.5 rounded-full hover:bg-blue-50 active:scale-95 cursor-pointer transition-all"
          title="FaceTime Call"
        >
          <Video className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {activeConversation.messages.map((message) => {
            const isPhotoMsg = message.content.startsWith("📷 Shared a sticker: ")
            const photoSrc = isPhotoMsg ? message.content.replace("📷 Shared a sticker: ", "") : null

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-xs"
                    : "bg-white text-gray-900 rounded-bl-xs border border-gray-200/60"
                    }`}
                >
                  {isPhotoMsg && photoSrc ? (
                    <img
                      src={photoSrc}
                      alt="Attachment"
                      className="rounded-xl w-full max-h-48 object-cover mb-1 shadow"
                    />
                  ) : (
                    <p className="leading-relaxed">{message.content}</p>
                  )}
                  <div
                    className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-400"
                      }`}
                  >
                    <span>{formatTime(new Date(message.timestamp))}</span>
                    {message.sender === "user" && <span>✓✓</span>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-2 shadow-sm">
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="flex items-center gap-1 text-gray-400 text-xs font-medium"
              >
                <span>Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </motion.div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Photo Picker Drawer */}
      <AnimatePresence>
        {isPhotoPickerOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="p-3 bg-white border-t shadow-xl"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Photo from Gallery
              </span>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {GALLERY_PHOTOS.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendPhoto(src)}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <img src={src} alt={`Gallery photo ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t relative z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
            className="text-gray-500 p-2 rounded-full hover:bg-gray-100 active:scale-95 cursor-pointer transition-all"
            title="Attach Photo"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center bg-gray-100 rounded-full border border-gray-200 px-3.5 py-1.5 focus-within:bg-white focus-within:border-blue-500 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="iMessage"
              className="flex-1 outline-none text-sm bg-transparent text-gray-900"
            />
            {inputValue ? (
              <button
                type="button"
                onClick={() => handleSend()}
                className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 active:scale-95 transition-all cursor-pointer shadow ml-1"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend("🎙️ Audio message recorded!")}
                className="text-gray-400 hover:text-gray-600 ml-1 p-0.5 cursor-pointer"
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
