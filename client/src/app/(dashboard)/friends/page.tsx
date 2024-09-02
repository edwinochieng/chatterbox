import FriendsList from "@/components/FriendsList";
import React from "react";

export default function MyFriendsPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[300px] xl:max-w-[400px]">
          <FriendsList />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full bg-gray-200 h-screen">
          <h1 className=" text-gray-800">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
