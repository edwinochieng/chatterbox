import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[280px] xl:max-w-[340px] border border-y-transparent border-l-transparent lg:border-r-gray-200">
          <ChatList />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full  h-screen">
          <h1 className="">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
