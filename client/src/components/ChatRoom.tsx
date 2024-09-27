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

export default function ChatRoom({ chat, friend }: any) {
  const { user } = useAuth();
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.userId;
  const friendId = friend?.id;

  useTabActivity();

  // Scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let lastDate: any;

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
          <TextInput chatId={chat?.id} />
        </div>
      </div>
    </div>
  );
}
