import ChatList from "@/components/ChatList";
import ChatRoom from "@/components/ChatRoom";
import React from "react";

export default function ChatDetailsPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="hidden lg:w-full lg:block lg:max-w-[280px] xl:max-w-[340px] border border-y-transparent border-l-transparent lg:border-r-gray-200">
          <ChatList />
        </div>

        {/**Chat room */}
        <div className="w-full bg-gray-200 h-screen ">
          <ChatRoom />
        </div>
      </div>
    </div>
  );
}
