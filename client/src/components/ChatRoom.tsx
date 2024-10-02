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
import { useQueryClient } from "@tanstack/react-query";

export default function ChatRoom({ chat, friend }: any) {
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();
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
    if (chat?.messages.length) {
      chat.messages.forEach((message: any) => {
        if (message.senderId !== userId) {
          socket?.emit("messageSeen", {
            chatId,
            messageId: message.id,
            userId,
          });
        }
      });
    }
    queryClient.invalidateQueries({
      queryKey: ["conversationDetails", "conversations"],
    });

    scrollToBottom();
  }, [chat, chatId, userId, socket, queryClient]);

  console.log(chat.messages);

  return (
    <div>
      <div className="flex flex-col h-screen">
        {/* Chat Navbar */}
        <ChatNavbar friend={friend} friendId={friendId} />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar xl:custom-scrollbar p-4 lg:p-12 space-y-2">
          {chat?.messages.map((message: any, index: number) => {
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
                        ? "bg-accentBg text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-lg font-medium">{message.content}</p>

                    <div className="ml-auto flex items-center">
                      <span className="text-sm">
                        {formatTimeToHoursAndMinutes(message.createdAt)}
                      </span>

                      {/* Seen UI text */}
                      {message.senderId === userId && (
                        <span>
                          {message.seen ? (
                            <span className="text-xs text-gray-500 ml-2">
                              Seen
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 ml-2">
                              Delivered
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
          {/* This ensures we scroll to the last message */}
        </div>

        {/* Add Typing Indicator */}

        {/* Text Input */}
        <div className="bg-white px-12 py-4">
          <TextInput chatId={chatId} />
        </div>
      </div>
    </div>
  );
}
