"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit, Trash2, Plus, Check } from "lucide-react"
import { useMessagesStore } from "@/lib/messages-state"
import { formatRelativeTime } from "@/lib/utils"

export function ConversationList() {
  const { conversations, setActiveConversation, deleteMultipleConversations, createConversation } = useMessagesStore()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [newRecipient, setNewRecipient] = useState("")
  const [newMessageText, setNewMessageText] = useState("")

  const filteredConversations = conversations.filter((c) =>
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleSelect = (id: string, e: React.SyntheticEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    deleteMultipleConversations(selectedIds)
    setSelectedIds([])
    setIsEditing(false)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecipient.trim() || !newMessageText.trim()) return
    createConversation(newRecipient, newMessageText)
    setNewRecipient("")
    setNewMessageText("")
    setIsComposeOpen(false)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 text-gray-900 select-none relative">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b mt-12 bg-white/80 backdrop-blur-md relative z-10">
        <button
          type="button"
          onClick={() => {
            setIsEditing(!isEditing)
            setSelectedIds([])
          }}
          className="text-blue-500 font-semibold text-base px-1 py-0.5 rounded active:opacity-60 cursor-pointer"
        >
          {isEditing ? "Done" : "Edit"}
        </button>
        <h1 className="text-lg font-bold">Messages</h1>
        <button
          type="button"
          onClick={() => setIsComposeOpen(true)}
          className="text-blue-500 p-1 rounded active:opacity-60 cursor-pointer"
          title="New Message"
        >
          <Edit className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3 bg-gray-50">
        <div className="flex items-center gap-2 bg-gray-200/80 rounded-xl px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="bg-transparent w-full outline-none text-sm text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                selectedIds.includes(conversation.id) ? "bg-blue-50" : "hover:bg-gray-100/80 active:bg-gray-200/50"
              }`}
              onClick={() => {
                if (isEditing) {
                  toggleSelect(conversation.id, { stopPropagation: () => {} } as any)
                } else {
                  setActiveConversation(conversation.id)
                }
              }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Checkbox in Edit mode */}
              {isEditing && (
                <div
                  onClick={(e) => toggleSelect(conversation.id, e)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedIds.includes(conversation.id)
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedIds.includes(conversation.id) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              )}

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.contact.avatar || "/images/contact.webp"}
                  alt={conversation.contact.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                {conversation.contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate text-base">{conversation.contact.name}</h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatRelativeTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {(() => {
                    const lastMsg = conversation.messages[conversation.messages.length - 1]?.content || ""
                    if (lastMsg.startsWith("📷") || lastMsg.includes("/images/")) {
                      return "📷 Sent a sticker"
                    }
                    return lastMsg
                  })()}
                </p>
              </div>

              {/* Unread count */}
              {!isEditing && conversation.unreadCount > 0 && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Mode Bottom Action Bar */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="p-3 bg-white border-t flex items-center justify-between px-6 shadow-lg z-20"
          >
            <span className="text-sm text-gray-500 font-medium">{selectedIds.length} Selected</span>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
              className={`flex items-center gap-1.5 font-semibold text-sm px-3 py-1.5 rounded-lg transition-all ${
                selectedIds.length > 0
                  ? "bg-red-500 text-white active:scale-95 cursor-pointer shadow"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message / Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b mt-12 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="text-blue-500 font-semibold"
              >
                Cancel
              </button>
              <h2 className="font-bold text-base">New Message</h2>
              <div className="w-12" />
            </div>

            <form onSubmit={handleCreate} className="p-4 flex-1 flex flex-col space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  To:
                </label>
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="Contact Name (e.g. John Doe)"
                  className="w-full border-b border-gray-200 py-2 outline-none text-base text-gray-900"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                  Message:
                </label>
                <textarea
                  required
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full flex-1 border rounded-xl p-3 outline-none resize-none text-base text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
