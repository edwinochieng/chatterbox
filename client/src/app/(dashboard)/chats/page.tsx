"use client";

import ChatList from "@/components/ChatList";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ActiveChat from "@/components/ActiveChat";

export default function ChatPage() {
  const activeChat = useSelector((state: RootState) => state.chats.activeChat);
  return (
    <div>
      <div className="flex flex-row ">
        <div
          className={`${
            activeChat ? "hidden lg:block" : "block"
          } w-full lg:max-w-[280px] xl:max-w-[340px] border border-y-transparent border-l-transparent lg:border-r-gray-200`}
        >
          <ChatList />
        </div>

        {/**Prompt */}
        <div
          className={`${
            activeChat ? "block" : "hidden lg:block"
          }  w-full h-screen`}
        >
          {activeChat && <ActiveChat />}
        </div>
      </div>
    </div>
  );
}
