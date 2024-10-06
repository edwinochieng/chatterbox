"use client";
import ChatList from "@/components/ChatList";
import ChatRoom from "@/components/ChatRoom";
import ProfileSidebar from "@/components/ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

export default function ChatDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const chatId = params.id;

  const { authTokens } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    return () => {
      if (socket && chatId) {
        socket.emit("leaveRoom", { chatId });
      }
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit("joinRoom", { chatId });
    }
  }, [socket, chatId]);

  const { data, isPending } = useQuery({
    queryKey: ["conversationDetails"],
    queryFn: async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/details/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
  });

  const conversation = data?.conversation;
  const friend = data?.friend;

  return (
    <div>
      <div className="flex flex-row ">
        <div className="hidden lg:w-full lg:block lg:max-w-[280px] xl:max-w-[340px] border border-y-transparent border-l-transparent lg:border-r-gray-200">
          <ChatList />
        </div>

        <div className="w-full h-screen ">
          {isPending ? (
            <div className="flex flex-col h-screen items-center justify-center">
              <span>Loading...</span>
            </div>
          ) : (
            <div className="flex flex-row">
              <div className="w-full h-screen ">
                <ChatRoom friend={friend} chat={conversation} />
              </div>

              <ProfileSidebar friend={friend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
