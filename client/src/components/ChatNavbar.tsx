"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function ChatNavbar({ friend }: any) {
  return (
    <div className="py-4 px-4 lg:px-12 bg-primary border border-t-transparent border-x-transparent">
      <div className="flex flex-row justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-[48px] w-[48px] border border-gray-200">
            <AvatarImage src={friend?.imageUrl || "/default-profile.jpg"} />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl">{friend?.fullName}</span>
            <span className="text-base font-medium text-green-500">Online</span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
