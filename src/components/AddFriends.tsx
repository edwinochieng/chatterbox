"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMdClose } from "react-icons/io";

export default function AddFriends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (searchTerm) {
      setResult({ name: "John Doe", email: "johndoe@example.com" });
    }
  };

  const friendRequests = [
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

  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold text-gray-800">Add Friends</h1>

          <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-4 border rounded-[8px] bg-gray-100">
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 mr-2 py-2 border-none outline-none bg-transparent"
            />
            <div onClick={handleSearch}>
              <CiSearch size={20} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {/**Search Results */}
          {result && (
            <div className="flex flex-row items-center space-x-4 my-1 py-2 px-6 cursor-pointer hover:bg-indigo-100">
              <div>
                <Avatar className="h-[48px] w-[48px]">
                  <AvatarImage src="/profile.jpg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-800 font-semibold text-lg">
                  John Doe
                </span>
                <span className="text-gray-700 font-medium text-base">
                  johndoe@example.com
                </span>
              </div>
            </div>
          )}

          {/** Friend Requests */}
          {!result && friendRequests && (
            <div className="h-full overflow-y-auto hidden-scrollbar">
              <div className="mt-10 mb-3 px-6">
                <h1 className="text-gray-900 font-semibold text-2xl">
                  Friend Requests
                </h1>
              </div>
              {friendRequests.map((request, index) => (
                <div key={index} className="flex justify-between px-6">
                  <div className="flex flex-row items-center space-x-4 my-1 py-2 cursor-pointer ">
                    <div>
                      <Avatar className="h-[48px] w-[48px]">
                        <AvatarImage src="/profile.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-semibold text-lg">
                        {request}
                      </span>
                      <span className="text-gray-700 font-medium text-base">
                        johndoe@example.com
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div>
                      <button className="text-white text-sm font-medium px-4 py-1.5 rounded-2xl bg-black  hover:bg-black/70">
                        Accept
                      </button>
                    </div>
                    <div className="cursor-pointer">
                      <IoMdClose size={24} />
                    </div>
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
