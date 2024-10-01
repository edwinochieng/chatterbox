"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import FriendRequests from "./FriendRequests";
import { useAuth } from "@/context/AuthContext";
import UserSkeleton from "./UserSkeleton";

export default function AddFriends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const queryClient = useQueryClient();
  const { user, authTokens } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    if (searchTerm) {
      try {
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/search?email=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.accessToken}`,
            },
          }
        );
        setSearchResult(result.data);
      } catch (error) {
        setSearchResult(null);
      }
    }
    setIsSearching(false);
    setHasSearched(true);
  };

  const sendRequest = useMutation({
    mutationFn: (requesteeId: { requesteeId: string }) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/friends/send-request`,
        requesteeId,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      setSearchResult((prevResult: any) => ({
        ...prevResult,
        isRequested: true,
      }));
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const handleSendRequest = (requesteeId: string) => {
    sendRequest.mutate({ requesteeId });
  };
  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">Add Friends</h1>

          <form
            onSubmit={handleSearch}
            className="flex flex-row items-center justify-between p-1 px-4 w-full my-4 border rounded-[8px] bg-gray-100"
          >
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 mr-2 py-2 border-none outline-none bg-transparent"
            />
            <button type="submit">
              <CiSearch size={20} />
            </button>
          </form>
        </div>

        <div className="mt-4">
          {/**Search Result */}

          {isSearching ? (
            <div className="px-6">
              <UserSkeleton />
            </div>
          ) : (
            <div>
              {searchResult ? (
                <div className="flex flex-row justify-between items-center my-1 py-2 px-6 ">
                  <div className="flex flex-row items-center space-x-4 ">
                    <div>
                      <Avatar className="h-[48px] w-[48px] border border-gray-200">
                        <AvatarImage
                          src={
                            searchResult.profilePicture ||
                            "/default-profile.jpg"
                          }
                        />
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-semibold text-lg">
                        {searchResult.fullName}
                      </span>
                      <span className="text-gray-700 font-medium text-base">
                        {searchResult.email}
                      </span>
                    </div>
                  </div>
                  {searchResult.id !== user?.userId && (
                    <div className="ml-auto">
                      {searchResult.isRequested ? (
                        <span className="text-gray-500">Requested</span>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(searchResult.id)}
                          className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                          disabled={sendRequest.isPending}
                        >
                          {sendRequest.isPending ? "Adding..." : "Add"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                hasSearched && (
                  <div className="mt-4">
                    <p className="text-center">No user found</p>
                  </div>
                )
              )}
            </div>
          )}

          {/** Friend Requests */}
          {!searchResult && <FriendRequests />}
        </div>
      </div>
    </div>
  );
}
