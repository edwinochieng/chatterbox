import AddFriends from "@/components/AddFriends";
import React from "react";

export default function DiscoverPage() {
  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-full lg:max-w-[300px] xl:max-w-[400px] border border-y-transparent border-l-transparent lg:border-r-gray-200">
          <AddFriends />
        </div>

        {/**Prompt */}
        <div className="hidden lg:block w-full  h-screen"></div>
      </div>
    </div>
  );
}
