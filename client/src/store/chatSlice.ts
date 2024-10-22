import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  createdAt: Date;
  content: string;
  senderId: string;
  iv: string;
  seen: boolean;
}

interface Chat {
  id: string;
  friend: any;
  messages: Message[];
  lastMessage: string;
  unreadMessagesCount: number;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    updateChat: (
      state,
      action: PayloadAction<{
        message: string;
        chatId: string;
        senderId: string;
        userId: string;
      }>
    ) => {
      const { message, chatId, senderId, userId } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);

      if (chat) {
        chat.lastMessage = message;

        if (senderId !== userId && state.activeChat?.id !== chatId) {
          chat.unreadMessagesCount += 1;
        }
      }
    },
    updateChatMessages: (
      state,
      action: PayloadAction<{ messages: Message[]; chatId: string }>
    ) => {
      const { messages, chatId } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat) {
        chat.messages = messages;

        if (messages.length > 0) {
          chat.lastMessage = messages[messages.length - 1].content;
        }
      }
    },
    resetUnreadMessagesCount: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat) {
        chat.unreadMessagesCount = 0;
      }
    },

    updateMessageSeenStatus: (
      state,
      action: PayloadAction<{ messageId: string; chatId: string }>
    ) => {
      const { messageId, chatId } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat) {
        const message = chat.messages.find(
          (message) => message.id === messageId
        );
        if (message) {
          message.seen = true;
        }
      }
    },
  },
});

export const {
  setChats,
  setActiveChat,
  updateChat,
  updateChatMessages,
  resetUnreadMessagesCount,
  updateMessageSeenStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
