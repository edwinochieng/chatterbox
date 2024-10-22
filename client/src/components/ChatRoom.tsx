"use client";
import React, { useEffect, useRef } from "react";
import TextInput from "./TextInput";
import ChatNavbar from "./ChatNavbar";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import useTabActivity from "@/hooks/useTabActivity";
import {
  formatDateWithOrdinal,
  formatTimeToHoursAndMinutes,
} from "@/lib/dateHelper";
import { styles } from "@/lib/style";
import {
  decryptMessage,
  deriveSharedKey,
  getPrivateKeyFromLocalStorage,
  getPublicKey,
} from "@/lib/encryption";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  resetUnreadMessagesCount,
  updateChat,
  updateMessageSeenStatus,
} from "../store/chatSlice";

export default function ChatRoom({ chatId, messages, friend }: any) {
  const { user } = useAuth();
  const socket = useSocket();
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.userId;
  const friendId = friend?.id;
  const friendPublicKey = friend?.publicKey;

  useTabActivity();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let lastDate: any;

  useEffect(() => {
    socket?.on("messageReceived", async (newMessage) => {
      const { content, iv, senderId } = newMessage;

      if (!content || !iv) {
        console.error(
          "Received message with missing content or iv",
          newMessage
        );
        return;
      }

      try {
        const encryptedMessageBuffer = Buffer.from(content, "base64");
        const ivBuffer = Buffer.from(iv, "base64");

        const encryptedMessageArray = new Uint8Array(encryptedMessageBuffer);
        const ivArray = new Uint8Array(ivBuffer);

        const privateKey = await getPrivateKeyFromLocalStorage();
        const publicKey = await getPublicKey(friendPublicKey);

        if (privateKey && publicKey && userId) {
          const sharedKey = await deriveSharedKey(privateKey, publicKey);

          const decryptedMessage = await decryptMessage(
            sharedKey,
            encryptedMessageArray,
            ivArray
          );

          dispatch(
            updateChat({
              message: { ...newMessage, content: decryptedMessage },
              chatId,
              senderId,
              userId,
            })
          );
        } else {
          console.error("Missing private key or public key");
        }
      } catch (error) {
        console.error("Error decrypting message:", error);
      }
    });

    return () => {
      socket?.off("messageReceived");
    };
  }, [socket, friendPublicKey, dispatch, userId, chatId]);

  useEffect(() => {
    const unseenMessages = messages.filter(
      (message: any) => message.senderId !== userId && !message.seen
    );
    unseenMessages.forEach((message: any) => {
      socket?.emit("seeMessage", {
        chatId,
        messageId: message.id,
        userId,
      });
    });
    scrollToBottom();
  }, [messages, chatId, userId, socket]);

  useEffect(() => {
    socket?.on("messageSeen", ({ messageId }) => {
      dispatch(updateMessageSeenStatus({ messageId, chatId }));
      dispatch(resetUnreadMessagesCount(chatId));
    });

    return () => {
      socket?.off("messageSeen");
    };
  }, [socket, dispatch, chatId]);

  return (
    <div>
      <div className="flex flex-col h-screen">
        {/* Chat Navbar */}
        <ChatNavbar friend={friend} friendId={friendId} />

        {/* Chat Messages */}

        <div className="flex-1 overflow-y-auto hidden-scrollbar xl:custom-scrollbar p-4 lg:p-12 space-y-2">
          {messages?.map((message: any) => {
            const showDate =
              formatDateWithOrdinal(message.createdAt) !== lastDate;
            lastDate = formatDateWithOrdinal(message.createdAt);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-gray-500 my-2">
                    {lastDate}
                  </div>
                )}
                <div
                  className={`flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl shadow ${
                      message.senderId === userId
                        ? `${styles.sentMessage}`
                        : `${styles.receivedMessage}`
                    }`}
                  >
                    <p className="text-lg font-medium">{message.content}</p>

                    <div className="ml-auto flex items-center">
                      <span className="text-sm">
                        {formatTimeToHoursAndMinutes(message.createdAt)}
                      </span>

                      {/* Seen status */}
                      {message.senderId === userId && (
                        <span>
                          {message.seen && (
                            <span className="text-xs text-white ml-2">
                              Seen
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />{" "}
          {/* Ensure scrolling to the last message */}
        </div>

        {/* Text Input */}
        <div className="px-12 py-4">
          <TextInput
            chatId={chatId}
            friendId={friendId}
            friendPublicKey={friendPublicKey}
          />
        </div>
      </div>
    </div>
  );
}
