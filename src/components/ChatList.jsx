"use client";
import React, { useState } from "react";

export default function ChatList() {
  const [searchTerm, setSearchTerm] = useState("");
  const chats = [
    "Chat 1",
    "Chat 2",
    "Chat 3",
    "Chat 4",
    "Chat 5",
    "Chat 6",
    "Chat 7",
    "Chat 8",
    "Chat 9",
    "Chat 10",
  ];

  const filteredChats = chats.filter((chat) =>
    chat.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="">
      <div className="flex flex-col h-full p-4">
        <input
          type="text"
          placeholder="Search chats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <div className="flex-grow overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <div key={index} className="p-2 border-b">
              {chat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
