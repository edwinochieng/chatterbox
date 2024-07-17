import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatPage() {
  return (
    <div>
      {/**Desktop */}
      <div className="flex flex-row ">
        <ChatList />

        {/**Prompt */}
        <div className="hidden lg:block w-full bg-gray-200 h-screen"></div>
      </div>
    </div>
  );
}
