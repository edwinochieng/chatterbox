import ChatList from "@/components/ChatList";
import React from "react";

export default function ChatDetailsPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="hidden lg:w-full lg:block lg:max-w-[280px] xl:max-w-[340px]">
          <ChatList />
        </div>

        {/**Chat room */}
        <div className="w-full bg-gray-200 h-screen">
          <h1 className=" text-gray-800">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
