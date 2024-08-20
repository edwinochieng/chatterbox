"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";

export default function Chat({ chat, index }: any) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      className={`w-full flex flex-row items-center my-3 px-6 py-2 cursor-pointer hover:bg-indigo-50 ${
        pathname === `/chats/${index}` ? "bg-indigo-100" : "bg-transparent"
      }`}
      onClick={() => router.push(`/chats/${index}`)}
    >
      <Avatar className="h-[42px] w-[42px]">
        <AvatarImage src="/profile.jpg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="ml-3 flex-1">
        <div className="flex flex-row items-center justify-between">
          <span className="text-gray-800 font-semibold text-base">
            John Doe
          </span>
          <span className="text-gray-500 font-medium text-sm">4.45 PM</span>
        </div>

        <div className="flex flex-row items-center justify-between ">
          <p className="text-sm text-gray-700 max-w-full">
            This is a dummy text. This is a dummy text
          </p>
        </div>
      </div>
    </div>
  );
}
