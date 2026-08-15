"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMessagesStore } from "@/lib/messages-state"
import { ConversationList } from "./conversation-list"
import { ConversationView } from "./conversation-view"

export function MessagesApp() {
  const { activeConversationId } = useMessagesStore()

  return (
    <div className="h-full w-full bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {activeConversationId ? (
          <motion.div
            key="conversation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0"
          >
            <ConversationView />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0"
          >
            <ConversationList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
