"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FriendsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const friends = [
    "Abel Abel",
    "Cherry Mansfield",
    "Drake Aubrey",
    "Bianca Joe",
    "Justin Timber",
    "Halsey Winstead",
    "Sandy Sims",
    "Peter Parker",
    "Lee Grant",
  ];

  const sortedFriends = friends.sort((a, b) => a.localeCompare(b));
  const filteredFriends = sortedFriends.filter((friend) =>
    friend.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full overflow-y-auto custom-scrollbar w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">My Friends</h1>

          <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-4 border rounded-[8px] bg-gray-100">
            <input
              type="text"
              placeholder="Find friends"
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
          {filteredFriends.map((friend, index) => (
            <div
              key={index}
              className="flex flex-row items-center space-x-4 my-1 py-2 px-6 cursor-pointer hover:bg-indigo-100"
            >
              <div>
                <Avatar className="h-[42px] w-[42px]">
                  <AvatarImage src="/profile.jpg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <span className="text-gray-800 font-semibold text-xl">
                  {friend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
