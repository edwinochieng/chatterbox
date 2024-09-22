"use client";
import React from "react";
import TextInput from "./TextInput";
import ChatNavbar from "./ChatNavbar";
import { useAuth } from "@/context/AuthContext";
import {
  formatDateWithOrdinal,
  formatTimeToHoursAndMinutes,
} from "@/lib/dateHelper";

export default function ChatRoom({ chat, friend }: any) {
  const { user } = useAuth();
  const userId = user?.userId;

  let lastDate = "";
  return (
    <div>
      <div className="flex flex-col h-screen  ">
        {/* Chat Navbar */}
        <ChatNavbar friend={friend} />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar xl:custom-scrollbar p-4 lg:p-12 space-y-2">
          {chat?.messages.map((message: any) => {
            const showDate = message.createdAt !== lastDate;
            lastDate = message.createdAt;
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-gray-500 my-2">
                    {formatDateWithOrdinal(message.createdAt)}
                  </div>
                )}
                <div
                  className={`flex ${
                    message.sender === userId ? "justify-end" : "justify-start"
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
                    <div className="ml-auto">
                      <span className="text-sm">
                        {formatTimeToHoursAndMinutes(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Text Input */}
        <div className="bg-white px-12 py-4">
          <TextInput chatId={chat?.id} />
        </div>
      </div>
    </div>
  );
}
