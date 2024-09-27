"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/context/SocketContext";

export default function ChatNavbar({ friend, friendId }: any) {
  const [isFriendOnline, setIsFriendOnline] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    socket?.emit("checkFriendStatus", friendId);

    const handleUserStatusUpdate = (data: {
      userId: string;
      isOnline: boolean;
    }) => {
      if (data.userId === friendId) {
        setIsFriendOnline(data.isOnline);
      }
    };

    socket?.on("userStatusUpdated", handleUserStatusUpdate);

    return () => {
      socket?.off("userStatusUpdated", handleUserStatusUpdate);
    };
  }, [socket, friendId]);

  return (
    <div className="py-4 px-4 lg:px-12 bg-primary border border-t-transparent border-x-transparent">
      <div className="flex flex-row justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-[48px] w-[48px] border border-gray-200">
            <AvatarImage src={friend?.imageUrl || "/default-profile.jpg"} />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl">{friend?.fullName}</span>
            <span className="text-base font-medium ">
              {isFriendOnline ? (
                <p className="text-green-500">Online</p>
              ) : (
                <p className="text-gray-700">Offline</p>
              )}
            </span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
