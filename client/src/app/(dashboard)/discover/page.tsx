import AddFriends from "@/components/AddFriends";
import React from "react";

export default function DiscoverPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[300px] xl:max-w-[400px]">
          <AddFriends />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full bg-gray-200 h-screen">
          <h1 className=" text-gray-800">Hello world</h1>
        </div>
      </div>
    </div>
  );
}
