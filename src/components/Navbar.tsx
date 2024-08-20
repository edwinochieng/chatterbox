"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="py-4 px-4 lg:px-12 bg-primary border border-t-transparent border-x-transparent">
      <div className="flex flex-row justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-[48px] w-[48px]">
            <AvatarImage src="/profile.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl">John Doe</span>
            <span className="text-base font-medium text-green-500">Online</span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
