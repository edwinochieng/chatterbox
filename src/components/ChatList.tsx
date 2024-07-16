"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

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
    <div className="flex flex-col p-6 h-full w-full lg:w-[300px]">
      <h1 className="text-3xl font-semibold text-gray-800">Messages</h1>

      <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-6 border rounded-[8px] bg-gray-100">
        <input
          type="text"
          placeholder="Search chats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-2 py-2 border-none outline-none bg-transparent"
        />
        <div>
          <CiSearch size={20} />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {filteredChats.map((chat, index) => (
          <div key={index} className="p-2 border-b">
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
}
