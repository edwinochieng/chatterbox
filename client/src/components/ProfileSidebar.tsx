"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSidebar() {
  return (
    <div className="hidden xl:block w-full max-w-[350px] h-screen bg-primary border border-gray-200 border-y-transparent border-r-transparent">
      <div className="p-4 flex flex-col items-center w-full">
        <div className="mt-24">
          <Avatar className="h-[170px] w-[170px]">
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <span className="mt-8 text-3xl text-center font-semibold">
          John Doe
        </span>
      </div>
    </div>
  );
}
