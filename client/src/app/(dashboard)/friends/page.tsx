import FriendsList from "@/components/FriendsList";
import React from "react";

export default function MyFriendsPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[300px] xl:max-w-[400px] border border-y-transparent border-l-transparent lg:border-r-gray-200">
          <FriendsList />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full  h-screen">
          <h1 className=" ">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
