"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Friend } from "@/types";

export default function ProfileSidebar({ friend }: { friend: Friend }) {
  return (
    <div className="hidden xl:block w-full max-w-[350px] h-screen bg-primary border border-gray-200  border-y-transparent border-r-transparent">
      <div className="p-4 flex flex-col items-center w-full">
        <div className="mt-24">
          <Avatar className="h-[170px] w-[170px] border border-gray-200 dark:border-transparent">
            <AvatarImage src={friend?.imageUrl || "/default-profile.jpg"} />
          </Avatar>
        </div>
        <span className="mt-8 text-3xl text-center font-semibold">
          {friend?.fullName}
        </span>
      </div>
    </div>
  );
}
