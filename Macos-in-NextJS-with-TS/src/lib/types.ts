export interface Song {
  id: string
  title: string
  artist: string
  albumArt: string
  audioUrl: string
}

export interface Album {
  id: string
  title: string
  artist: string
  artwork: string
  songs: Song[]
}

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

export interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: number
  currentSong?: Song
}

export type AppName =
  | "clock"
  | "settings"
  | "weather"
  | "calendar"
  | "camera"
  | "photos"
  | "notes"
  | "messages"
  | "safari"
  | "music"
  | "phone"
