export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  recipientId: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface ChatState {
  currentChat: Chat | null;
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
}