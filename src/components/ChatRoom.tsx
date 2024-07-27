"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function ChatRoom() {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col h-screen  ">
        {/* Navbar */}
        <div className="py-4 px-12 bg-primary">
          <div className="flex flex-row justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-[48px] w-[48px]">
                <AvatarImage src="/profile.jpg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-2xl">John Doe</span>
                <span className="text-base font-medium text-green-500">
                  Online
                </span>
              </div>
            </div>
            <div></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {/* Example Chat Messages */}
          <div className="mb-2">
            <div className="bg-white p-2 rounded shadow">
              <p>User 1: Hello!</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="bg-white p-2 rounded shadow">
              <p>User 2: Hi there!</p>
            </div>
          </div>
          {/* Add more chat messages here */}
        </div>

        {/* Text Input */}
        <div className="bg-white p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
