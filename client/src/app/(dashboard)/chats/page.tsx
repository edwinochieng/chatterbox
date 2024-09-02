import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[280px] xl:max-w-[340px]">
          <ChatList />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full bg-gray-200 h-screen">
          <h1 className=" text-gray-800">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
