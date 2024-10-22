"use client";

import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Chat from "./Chat";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserSkeleton from "./UserSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  setChats,
  setActiveChat,
  updateChatMessages,
} from "../store/chatSlice";
import { styles } from "@/lib/style";
import {
  decryptMessage,
  deriveSharedKey,
  getPrivateKeyFromLocalStorage,
  getPublicKey,
} from "@/lib/encryption";

export default function ChatList() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const { authTokens } = useAuth();
  const dispatch: AppDispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.chats.chats);
  const activeChat = useSelector((state: RootState) => state.chats.activeChat);

  const { data, isLoading, isSuccess } = useQuery({
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

  useEffect(() => {
    if (isSuccess && data?.conversations) {
      dispatch(setChats(data.conversations));
    }
  }, [isSuccess, data?.conversations, dispatch]);

  useEffect(() => {
    const decryptAllChatsMessages = async () => {
      if (!chats?.length) return;

      const privateKey = await getPrivateKeyFromLocalStorage();
      if (!privateKey) {
        console.error("Missing private key for decryption");
        return;
      }

      try {
        const decryptionPromises = chats.map(async (chat) => {
          const publicKey = await getPublicKey(chat.friend.publicKey);
          if (!publicKey) {
            console.error(`Missing public key for chat: ${chat.id}`);
            return chat; // Return original chat in case of error
          }

          const sharedKey = await deriveSharedKey(privateKey, publicKey);

          const decryptedMessages = await Promise.all(
            chat.messages.map(async (message: any) => {
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
              return message; // If no content/iv, return original message
            })
          );

          return { ...chat, messages: decryptedMessages };
        });

        const decryptedChats = await Promise.all(decryptionPromises);

        // Dispatch to update all chats
        decryptedChats.forEach((decryptedChat) =>
          dispatch(
            updateChatMessages({
              messages: decryptedChat.messages,
              chatId: decryptedChat.id,
            })
          )
        );
      } catch (error) {
        console.error("Error during chat decryption:", error);
      }
    };

    setIsDecrypting(true);
    decryptAllChatsMessages().then(() => setIsDecrypting(false));
  }, [chats, dispatch]);

  const filteredChats = chats?.filter((chat) =>
    chat.friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat: any) => {
    dispatch(setActiveChat(chat));
  };

  return (
    <div className="max-h-screen bg-primary">
      <div className="h-full overflow-y-auto custom-scrollbar w-full">
        <div className="mt-5 px-6">
          <h1 className="text-3xl font-semibold">Messages</h1>
          <div className="">
            <div className="flex flex-row items-center justify-between p-1 px-4 w-full my-6 border rounded-[8px] bg-gray-100">
              <input
                type="text"
                placeholder="Search chats"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 mr-2 py-2 border-none outline-none bg-transparent dark:text-gray-800"
              />
              <div>
                <CiSearch size={20} className="dark:text-gray-800" />
              </div>
            </div>
          </div>
        </div>

        {isLoading || isDecrypting ? (
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
                  {filteredChats
                    ?.filter((chat) => chat.lastMessage)
                    .map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatClick(chat)}
                        className={`${
                          activeChat?.id === chat.id
                            ? "bg-indigo-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-800"
                            : `${styles.hoverFriend}`
                        }`}
                      >
                        <Chat
                          friend={chat.friend}
                          lastMessage={chat.lastMessage}
                          unreadMessagesCount={chat.unreadMessagesCount}
                        />
                      </div>
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
