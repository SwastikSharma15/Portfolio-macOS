"use client"

import { create } from "zustand"
import type { Message, Conversation } from "./types"

interface MessagesState {
  conversations: Conversation[]
  activeConversationId: string | null
  addMessage: (conversationId: string, message: Message) => void
  setActiveConversation: (id: string | null) => void
  markAsRead: (conversationId: string) => void
  addReaction: (conversationId: string, messageId: string, reaction: string) => void
  deleteConversation: (conversationId: string) => void
  deleteMultipleConversations: (ids: string[]) => void
  createConversation: (name: string, initialMessage: string) => void
}

const initialConversations: Conversation[] = [
  {
    id: "troll-sticker-chat",
    contact: {
      id: "troll-master",
      name: "Sticker Wars 🤡",
      avatar: "/images/trash-1.png",
      isOnline: true,
    },
    messages: [
      {
        id: "t1",
        content: "📷 Shared a sticker: /images/trash-1.png",
        sender: "assistant",
        timestamp: Date.now() - 1000 * 60 * 20,
        status: "read",
      },
      {
        id: "t2",
        content: "📷 Shared a sticker: /images/trash-2.jpg",
        sender: "user",
        timestamp: Date.now() - 1000 * 60 * 15,
        status: "read",
      },
      {
        id: "t3",
        content: "📷 Shared a sticker: /images/trash-4.jpg",
        sender: "assistant",
        timestamp: Date.now() - 1000 * 60 * 10,
        status: "read",
      },
      {
        id: "t4",
        content: "📷 Shared a sticker: /images/trash-3.jpg",
        sender: "user",
        timestamp: Date.now() - 1000 * 60 * 5,
        status: "delivered",
      },
    ],
    lastMessageAt: Date.now() - 1000 * 60 * 5,
    unreadCount: 1,
  },
]

export const useMessagesStore = create<MessagesState>((set) => ({
  conversations: initialConversations,
  activeConversationId: null,
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessageAt: message.timestamp,
            unreadCount: conv.unreadCount + (message.sender === "assistant" ? 1 : 0),
          }
          : conv,
      ),
    })),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({
              ...msg,
              status: msg.sender === "user" ? "read" : msg.status,
            })),
          }
          : conv,
      ),
    })),
  addReaction: (conversationId, messageId, reaction) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId
                ? {
                  ...msg,
                  reactions: [...(msg.reactions || []), reaction],
                }
                : msg,
            ),
          }
          : conv,
      ),
    })),
  deleteConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
      activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId,
    })),
  deleteMultipleConversations: (ids) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => !ids.includes(c.id)),
      activeConversationId: ids.includes(state.activeConversationId || "") ? null : state.activeConversationId,
    })),
  createConversation: (name, initialMessage) =>
    set((state) => {
      const newId = `conv-${Date.now()}`
      const newConv: Conversation = {
        id: newId,
        contact: {
          id: `contact-${Date.now()}`,
          name: name.trim() || "New Contact",
          avatar: "/images/contact.webp",
          isOnline: true,
        },
        messages: [
          {
            id: `msg-${Date.now()}`,
            content: initialMessage,
            sender: "user",
            timestamp: Date.now(),
            status: "delivered",
          },
        ],
        lastMessageAt: Date.now(),
        unreadCount: 0,
      }
      return {
        conversations: [newConv, ...state.conversations],
        activeConversationId: newId,
      }
    }),
}))
