import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatDetailsPage() {
  return (
    <div>
      <div className="relative flex flex-row ">
        <div className="">
          <ChatList />
        </div>

        {/**Chat room */}
        <div className="w-full bg-gray-200 h-screen"></div>
      </div>
    </div>
  );
}
