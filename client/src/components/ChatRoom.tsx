"use client";
import React, { useEffect, useState, useRef } from "react";
import TextInput from "./TextInput";
import ChatNavbar from "./ChatNavbar";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import useTabActivity from "@/hooks/useTabActivity";
import {
  formatDateWithOrdinal,
  formatTimeToHoursAndMinutes,
} from "@/lib/dateHelper";
import { useChat } from "@/context/ChatContext";
import { styles } from "@/lib/style";

export default function ChatRoom({ chat, friend }: any) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(chat?.messages);
  const socket = useSocket();
  const { resetUnreadMessagesCount, updateChats } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.userId;
  const friendId = friend?.id;
  const chatId = chat?.id;

  useTabActivity();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let lastDate: any;

  useEffect(() => {
    socket?.on("messageReceived", (newMessage) => {
      setMessages((prevMessages: any) => [...prevMessages, newMessage]);
      updateChats(newMessage.content, chatId);
    });

    return () => {
      socket?.off("messageReceived");
    };
  }, [socket, updateChats, chatId]);

  useEffect(() => {
    if (messages.length) {
      messages.forEach((message: any) => {
        if (message.senderId !== userId) {
          socket?.emit("seeMessage", {
            chatId,
            messageId: message.id,
            userId,
          });
        }
      });
    }

    scrollToBottom();
  }, [messages, chatId, userId, socket]);

  useEffect(() => {
    // Listen for message seen updates
    socket?.on("messageSeen", ({ messageId }) => {
      setMessages((prevMessages: any) =>
        prevMessages.map((message: any) =>
          message.id === messageId ? { ...message, seen: true } : message
        )
      );
      resetUnreadMessagesCount(chatId);
    });

    return () => {
      socket?.off("messageSeen");
    };
  }, [socket, resetUnreadMessagesCount, chatId]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        {/* Chat Navbar */}
        <ChatNavbar friend={friend} friendId={friendId} />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar xl:custom-scrollbar p-4 lg:p-12 space-y-2">
          {messages.map((message: any) => {
            const showDate =
              formatDateWithOrdinal(message.createdAt) !== lastDate;
            lastDate = formatDateWithOrdinal(message.createdAt);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-gray-500 my-2">
                    {lastDate}
                  </div>
                )}
                <div
                  className={`flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl shadow ${
                      message.senderId === userId
                        ? `${styles.sentMessage}`
                        : `${styles.receivedMessage}`
                    }`}
                  >
                    <p className="text-lg font-medium">{message.content}</p>

                    <div className="ml-auto flex items-center">
                      <span className="text-sm">
                        {formatTimeToHoursAndMinutes(message.createdAt)}
                      </span>

                      {/* Seen status */}
                      {message.senderId === userId && (
                        <span>
                          {message.seen && (
                            <span className="text-xs text-white ml-2">
                              Seen
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />{" "}
          {/* Ensure scrolling to the last message */}
        </div>

        {/* Text Input */}
        <div className="px-12 py-4">
          <TextInput chatId={chatId} />
        </div>
      </div>
    </div>
  );
}
