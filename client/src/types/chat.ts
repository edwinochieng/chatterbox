export interface Chat {
  id: string;
  friend: any;
  messages: Message[];
  lastMessage: Message;
  unreadMessagesCount: number;
}
export interface Message {
  id: string;
  createdAt: Date;
  content: string;
  senderId: string;
  iv: string;
  seen: boolean;
}
