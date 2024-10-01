"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserSkeleton from "./UserSkeleton";

export default function FriendsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { authTokens } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friendsList"],
    queryFn: async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/get-friends`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
  });

  const { data: conversation, mutate } = useMutation({
    mutationFn: async (friendId: { friendId: string }) => {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/search`,
        friendId,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const myFriends = data?.friends;
  const chatId = conversation?.id;

  const filteredFriends = myFriends?.filter((friend: any) =>
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = (friendId: string) => {
    mutate({ friendId });
    console.log("ChatId:", chatId);

    router.push(`/chats/${chatId}`);
  };
  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full overflow-y-auto custom-scrollbar w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">My Friends</h1>

          <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-4 border rounded-[8px] bg-gray-100">
            <input
              type="text"
              placeholder="Search name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 mr-2 py-2 border-none outline-none bg-transparent"
            />
            <div>
              <CiSearch size={20} />
            </div>
          </div>
        </div>

        <div className="mt-4">
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
              {filteredFriends?.map((friend: any) => (
                <div
                  key={friend?.id}
                  className="flex flex-row items-center space-x-4 my-1 py-2 px-6 cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleStartChat(friend?.id)}
                >
                  <div>
                    <Avatar className="h-[42px] w-[42px] border border-gray-200">
                      <AvatarImage
                        src={friend?.imageUrl || "/default-profile.jpg"}
                      />
                    </Avatar>
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold text-xl">
                      {friend?.fullName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
