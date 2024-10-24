"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserSkeleton from "./UserSkeleton";
import { RiMessage3Fill } from "react-icons/ri";
import { setActiveChat, updateChatMessages } from "@/store/chatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  decryptMessage,
  deriveSharedKey,
  getPrivateKeyFromLocalStorage,
  getPublicKey,
} from "@/lib/encryption";
import { Chat, Message, SearchedFriend } from "@/types";

const decryptChatMessages = async (chat: Chat) => {
  if (!chat || !chat.messages?.length) return chat;

  const privateKey = await getPrivateKeyFromLocalStorage();
  if (!privateKey) {
    console.error("Missing private key for decryption");
    return chat;
  }

  try {
    const publicKey = await getPublicKey(chat.friend.publicKey);
    if (!publicKey) {
      console.error(`Missing public key for chat: ${chat.id}`);
      return chat;
    }

    const sharedKey = await deriveSharedKey(privateKey, publicKey);

    const decryptedMessages = await Promise.all(
      chat.messages.map(async (message: Message) => {
        if (message.content && message.iv) {
          try {
            const encryptedMessageBuffer = Buffer.from(
              message.content,
              "base64"
            );
            const ivBuffer = Buffer.from(message.iv, "base64");

            const decryptedMessage = await decryptMessage(
              sharedKey,
              new Uint8Array(encryptedMessageBuffer),
              new Uint8Array(ivBuffer)
            );

            return { ...message, content: decryptedMessage };
          } catch (error) {
            console.error(
              `Error decrypting message in chat ${chat.id}:`,
              error
            );
            return message;
          }
        }
        return message;
      })
    );

    return { ...chat, messages: decryptedMessages };
  } catch (error) {
    console.error(
      `Error during message decryption for chat ${chat.id}:`,
      error
    );
    return chat; // Return original chat on error
  }
};

export default function FriendsList() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { authTokens } = useAuth();
  const dispatch: AppDispatch = useDispatch();
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

  const { mutate } = useMutation({
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
    onSuccess: async (response) => {
      const chat = response?.conversation;
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      const decryptedChat = await decryptChatMessages(chat);

      dispatch(
        updateChatMessages({
          messages: decryptedChat.messages,
          chatId: decryptedChat.id,
        })
      );

      dispatch(setActiveChat(decryptedChat));

      router.push(`/chats`);
    },
  });

  const myFriends = data?.friends;

  const filteredFriends = myFriends?.filter((friend: SearchedFriend) =>
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = (friendId: string) => {
    mutate({ friendId });
  };

  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full overflow-y-auto custom-scrollbar w-full ">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold ">My Friends</h1>

          <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-4 border rounded-[8px] bg-gray-100">
            <input
              type="text"
              placeholder="Search name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 mr-2 py-2 border-none outline-none bg-transparent dark:text-gray-800"
            />
            <div>
              <CiSearch size={20} className="dark:text-gray-800" />
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
              {filteredFriends?.map((friend: SearchedFriend) => (
                <div
                  key={friend?.id}
                  className={`flex flex-row items-center justify-between my-1 py-2 px-6 `}
                >
                  <div className={`flex flex-row items-center space-x-4  `}>
                    <div>
                      <Avatar className="h-[42px] w-[42px] border border-gray-200 dark:border-transparent">
                        <AvatarImage
                          src={friend?.imageUrl || "/default-profile.jpg"}
                        />
                      </Avatar>
                    </div>
                    <div>
                      <span className="font-semibold text-xl">
                        {friend?.fullName}
                      </span>
                    </div>
                  </div>
                  <div
                    onClick={() => handleStartChat(friend?.id)}
                    className="cursor-pointer"
                  >
                    <RiMessage3Fill size={30} />
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
