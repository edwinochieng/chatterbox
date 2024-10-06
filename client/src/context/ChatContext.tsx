"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Chat {
  id: string;
  friend: any;
  lastMessage: string;
  unreadMessagesCount: number;
}

interface ChatContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  updateChats: (message: string, chatId: string) => void;
  resetUnreadMessagesCount: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const updateChats = (message: string, chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: message,
              unreadMessagesCount: chat.unreadMessagesCount + 1,
            }
          : chat
      )
    );
  };

  const resetUnreadMessagesCount = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadMessagesCount: 0 } : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        updateChats,
        resetUnreadMessagesCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
