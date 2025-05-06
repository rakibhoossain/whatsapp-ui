export interface Contact {
  jid: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  lastMessageStatus?: string
  isOnline: boolean
  lastSeen: Date
  unreadCount: number
  isBlocked?: boolean
  isArchived?: boolean
}

export interface ReplyTo {
  id: string
  content: string
  senderId: string
}

export interface Reaction {
  emoji: string
  userId: string
}

export interface Message {
  id: string
  content: string
  timestamp: Date
  senderId: string
  receiverId: string
  status?: "sending" | "sent" | "delivered" | "read" | "failed"
  type?: "text" | "media" | "audio" | "location" | "contact"
  reactions?: Reaction[]
  replyTo?: ReplyTo
  attachments?: string[]
  isDeleted?: boolean
  isForwarded?: boolean
}

export interface WidgetConfig {
  authToken: string
  apiEndpoint: string
  wsEndpoint: string
  position: {
    bottom?: string
    right?: string
    left?: string
  }
  size: {
    width?: string
    height?: string
  }
  companyName?: string
  companyLogo?: string
  unreadCount: number
  persistentWidget?: boolean
  showButtonWhenOpen?: boolean
}
