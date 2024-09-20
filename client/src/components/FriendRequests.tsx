"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function FriendRequests() {
  const { authTokens } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/get-requests`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
      return result.data;
    },
  });

  const acceptRequest = useMutation({
    mutationFn: (friendshipId: string) => {
      return axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/accept-request/${friendshipId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendsList"] });
    },
  });

  const deleteRequest = useMutation({
    mutationFn: (friendshipId: string) => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/delete-request/${friendshipId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  return (
    <>
      {data?.friendRequests?.length > 0 && (
        <div className="h-full overflow-y-auto hidden-scrollbar">
          <div className="mt-10 mb-3 px-6">
            <h1 className="text-gray-900 font-semibold text-2xl">
              Friend Requests
            </h1>
          </div>
          {data?.friendRequests.map(({ id, requester }: any) => (
            <div key={id} className="flex justify-between px-6">
              <div className="flex flex-row items-center space-x-4 my-1 py-2 cursor-pointer ">
                <div>
                  <Avatar className="h-[48px] w-[48px] border border-gray-200">
                    <AvatarImage
                      src={requester.imageUrl || "/default-profile.jpg"}
                    />
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-semibold text-lg">
                    {requester.fullName}
                  </span>
                  <span className="text-gray-700 font-medium text-base">
                    {requester.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div>
                  <button
                    onClick={() => acceptRequest.mutate(id)}
                    className="text-white text-sm font-medium px-4 py-1.5 rounded-2xl bg-black  hover:bg-black/70"
                    disabled={acceptRequest.isPending}
                  >
                    {acceptRequest.isPending ? "Accepting..." : "Accept"}
                  </button>
                </div>
                <div
                  onClick={() => deleteRequest.mutate(id)}
                  className="cursor-pointer"
                >
                  <IoMdClose size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
