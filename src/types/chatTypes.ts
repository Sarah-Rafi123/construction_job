export interface Participant {
    _id: string
    email: string
    role: string
    company_name: string
    full_name:string
    profile_picture:string
  }
  
  export interface LastMessage {
    _id: string
    sender: Participant
    content: string
    type: string
    updatedAt: string
  }
  
  export interface Chat {
    _id: string
    participants: Participant[]
    lastMessage: LastMessage
    createdAt: string
    updatedAt: string
    __v: number
  }

 export interface EnquiryMessage {
    _id: string
    conversation: string
    sender: string
    type: "enquiry"
    status: string
    enquiry: {
      title: string
      description: string
      jobId: string
    }
    createdAt: string
    updatedAt: string
    __v: number
  }
  
 export interface TextMessage {
    _id: string
    conversation: string
    sender:string
    type: "text"
    status: string
    content: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  
  export type Message = EnquiryMessage | TextMessage
  
  
  export interface InboxResponse {
    status: string
    results: number
    data: Chat[]
  }
  
  export interface MessagesResponse {
    status: string
    results: number
    data: Message[]
  }


  export interface ChatState {
    inbox: Chat[] | null
    activeConversation: Chat | null
    messages: Message[] | null
  }