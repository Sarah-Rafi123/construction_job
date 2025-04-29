export interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  country?: string
}

export interface Message {
  senderId: string
  text: string
  time: string
  images?: string[]
  date?: string
  systemMessage?: boolean
  reaction?: string
}

export interface Conversation {
  id: string
  userId: string
  preview: string
  unreadCount: number
  messages: Message[]
  expired?: boolean
  roomNumber?: string
  category?: string
  dateRange?: string
}
export interface Contractor {
  id: number
  name: string
  avatar: string
  complianceCertificate: boolean
  verificationCertificate: boolean
  status: "pending" | "accepted" | "declined"
}
