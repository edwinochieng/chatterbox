import React from "react";
import ChatList from "@/components/ChatList";

export default function ChatPage() {
  return (
    <div>
      {/**Desktop */}
      <div className="flex flex-row ">
        {/**Chat list */}
        <div className="w-[300px]">
          <ChatList />
        </div>

        {/**Prompt */}
        <div className="w-full bg-yellow-200 h-screen"></div>
      </div>
    </div>
  );
}
