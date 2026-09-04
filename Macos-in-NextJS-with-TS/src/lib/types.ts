export interface Message {
  id: string
  content: string
  sender: string
  timestamp: number
  status?: "sending" | "sent" | "delivered" | "read"
  reactions?: string[]
}

export interface Conversation {
  id: string
  contact: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
  }
  messages: Message[]
  lastMessageAt: number
  unreadCount: number
}
