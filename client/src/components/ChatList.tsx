"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Chat from "./Chat";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserSkeleton from "./UserSkeleton";

export default function ChatList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { authTokens } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/get-conversations`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
  });

  const chats = data?.conversations;

  const filteredChats = chats?.filter((chat: any) =>
    chat.friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full overflow-y-auto custom-scrollbar w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">Messages</h1>
          <div className="">
            <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-6 border rounded-[8px] bg-gray-100">
              <input
                type="text"
                placeholder="Search chats"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 mr-2 py-2 border-none outline-none bg-transparent"
              />
              <div>
                <CiSearch size={20} />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="px-6 my-3 py-2" key={index}>
                <UserSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {chats?.length > 0 ? (
              <div>
                <div>
                  {filteredChats?.map((chat: any) => (
                    <Chat
                      key={chat.id}
                      id={chat.id}
                      friend={chat.friend}
                      lastMessage={chat?.lastMessage}
                      unreadMessagesCount={chat.unreadMessagesCount}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-screen items-center">
                <div className="px-6 mt-[70%]">
                  <span>Start new chat</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
