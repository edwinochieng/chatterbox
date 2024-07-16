import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatPage() {
  return (
    <div>
      {/**Desktop */}
      <div className="flex flex-row ">
        <div>
          <ChatList />
        </div>

        {/**Prompt */}
        <div className="w-full bg-yellow-200 h-screen"></div>
      </div>
    </div>
  );
}
