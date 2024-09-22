"use client";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { formatDateForMessages } from "@/lib/dateHelper";

export default function Chat({
  id,
  friend,
  lastMessage,
  unreadMessagesCount,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      className={`w-full flex flex-row items-center my-3 px-6 py-2 cursor-pointer hover:bg-indigo-50 ${
        pathname === `/chats/${id}` ? "bg-indigo-100" : "bg-transparent"
      }`}
      onClick={() => router.push(`/chats/${id}`)}
    >
      <Avatar className="h-[42px] w-[42px] border border-gray-200">
        <AvatarImage src={friend?.imageUrl || "/default-profile.jpg"} />
      </Avatar>

      <div className="ml-3 flex-1">
        <div className="flex flex-row items-center justify-between">
          <span className="text-gray-800 font-semibold text-base">
            {friend?.fullName}
          </span>
          <span className="text-gray-500 font-medium text-sm">
            {formatDateForMessages(lastMessage?.createdAt)}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between ">
          <p className="text-sm text-gray-700 max-w-full">
            {lastMessage?.content}
          </p>
        </div>
      </div>
    </div>
  );
}
