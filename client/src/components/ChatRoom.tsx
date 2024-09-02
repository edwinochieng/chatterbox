"use client";
import React from "react";

import { useRouter } from "next/navigation";
import TextInput from "./TextInput";
import ChatNavbar from "./ChatNavbar";

const messages = [
  { id: 1, sender: "user1", content: "Hello!", date: "Yesterday" },
  { id: 2, sender: "user2", content: "Hi there!", date: "Yesterday" },
  { id: 3, sender: "user1", content: "How are you?", date: "Yesterday" },
  { id: 4, sender: "user2", content: "I am good, thanks!", date: "Yesterday" },
  { id: 5, sender: "user1", content: "What about you?", date: "Yesterday" },
  { id: 6, sender: "user2", content: "I am good, thanks!", date: "Today" },
  { id: 7, sender: "user1", content: "What about you?", date: "Today" },
  { id: 8, sender: "user2", content: "I am good, thanks!", date: "Today" },
  { id: 9, sender: "user1", content: "What about you?", date: "Today" },
  { id: 10, sender: "user2", content: "I am good, thanks!", date: "Today" },
  { id: 11, sender: "user1", content: "What about you?", date: "Today" },
  { id: 12, sender: "user2", content: "I am good, thanks!", date: "Today" },
  {
    id: 13,
    sender: "user1",
    content:
      "Hello hello hello hello hello hello hello hello hello hello hello hello hello",
    date: "Today",
  },
  { id: 14, sender: "user2", content: "I am good, thanks!", date: "Today" },
  {
    id: 15,
    sender: "user1",
    content:
      "Hello hello hello hello hello hello hello hello hello hello hello hello hello",
    date: "Today",
  },
  { id: 16, sender: "user2", content: "I am good, thanks!", date: "Today" },
  {
    id: 17,
    sender: "user1",
    content:
      "Hello hello hello hello hello hello hello hello hello hello hello hello hello",
    date: "Today",
  },
  { id: 18, sender: "user2", content: "I am good, thanks!", date: "Today" },
  {
    id: 19,
    sender: "user1",
    content:
      "Hello hello hello hello hello hello hello hello hello hello hello hello hello",
    date: "Today",
  },
  { id: 20, sender: "user2", content: "I am good, thanks!", date: "Today" },
  {
    id: 21,
    sender: "user1",
    content:
      "Hello hello hello hello hello hello hello hello hello hello hello hello hello",
    date: "Today",
  },
];

export default function ChatRoom() {
  const router = useRouter();

  let lastDate = "";
  return (
    <div>
      <div className="flex flex-col h-screen  ">
        {/* Chat Navbar */}
        <ChatNavbar />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto hidden-scrollbar xl:custom-scrollbar p-4 lg:p-12 space-y-2">
          {messages.map((message) => {
            const showDate = message.date !== lastDate;
            lastDate = message.date;
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-gray-500 my-2">
                    {message.date}
                  </div>
                )}
                <div
                  className={`flex ${
                    message.sender === "user1" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl shadow ${
                      message.sender === "user1"
                        ? "bg-accentBg text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-lg font-medium">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Text Input */}
        <div className="bg-white px-12 py-4">
          <TextInput />
        </div>
      </div>
    </div>
  );
}
