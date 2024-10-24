"use client";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDateForMessages } from "@/lib/dateHelper";

export default function Chat({
  friend,
  lastMessage,
  unreadMessagesCount,
}: any) {
  return (
    <div
      className={`w-full flex flex-row items-center my-3 px-6 py-3 cursor-pointer  `}
    >
      <Avatar className="h-[42px] w-[42px] border border-gray-200">
        <AvatarImage src={friend?.imageUrl || "/default-profile.jpg"} />
      </Avatar>

      <div className="ml-3 flex-1">
        <div className="flex flex-row items-center justify-between">
          <span className="dark:text-gray-100 font-semibold text-base">
            {friend?.fullName}
          </span>
          {lastMessage && (
            <span className="text-gray-500 dark:text-gray-50 font-medium text-sm">
              {formatDateForMessages(lastMessage?.createdAt)}
            </span>
          )}
        </div>

        <div className="flex flex-row items-center justify-between ">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-full">
              {lastMessage?.content}
            </p>
          </div>

          <div>
            {unreadMessagesCount > 0 && (
              <div className="relative inline-flex items-center justify-center w-6 h-6 bg-accentBg text-white rounded-full">
                <span className="text-[10px] font-semibold">
                  {unreadMessagesCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
