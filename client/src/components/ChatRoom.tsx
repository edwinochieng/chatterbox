"use client";
import React, { useEffect, useState, useRef } from "react";
import TextInput from "./TextInput";
import ChatNavbar from "./ChatNavbar";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import useTabActivity from "@/hooks/useTabActivity";
import {
  formatDateWithOrdinal,
  formatTimeToHoursAndMinutes,
} from "@/lib/dateHelper";
import { useChat } from "@/context/ChatContext";
import { styles } from "@/lib/style";
import {
  decryptMessage,
  deriveSharedKey,
  getPrivateKeyFromLocalStorage,
  getPublicKey,
} from "@/lib/encryption";

export default function ChatRoom({ chat, friend }: any) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(chat?.messages);
  const socket = useSocket();
  const { resetUnreadMessagesCount, updateChats } = useChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.userId;
  const friendId = friend?.id;
  const friendPublicKey = friend?.publicKey;
  const chatId = chat?.id;

  useTabActivity();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let lastDate: any;

  useEffect(() => {
    const decryptPreviousMessages = async () => {
      if (!messages?.length) {
        return;
      }
      const privateKey = await getPrivateKeyFromLocalStorage();
      const publicKey = await getPublicKey(friendPublicKey);

      if (privateKey && publicKey) {
        const sharedKey = await deriveSharedKey(privateKey, publicKey);
        const decryptedMessages = await Promise.all(
          messages.map(async (message: any) => {
            if (message.content && message.iv) {
              try {
                const encryptedMessageBuffer = Buffer.from(
                  message.content,
                  "base64"
                );
                const ivBuffer = Buffer.from(message.iv, "base64");

                const encryptedMessageArray = new Uint8Array(
                  encryptedMessageBuffer
                );
                const ivArray = new Uint8Array(ivBuffer);

                // Decrypt the message content
                const decryptedMessage = await decryptMessage(
                  sharedKey,
                  encryptedMessageArray,
                  ivArray
                );

                console.log("Decrypted Previous Message:", decryptedMessage); // Log decrypted message
                return { ...message, content: decryptedMessage }; // Return decrypted message
              } catch (error) {
                console.error("Error decrypting previous message:", error);
                return message; // Return original message if decryption fails
              }
            }
            return message; // Return the original message if not encrypted
          })
        );

        // Update the state with decrypted messages
        setMessages(decryptedMessages);
      } else {
        console.error("Missing private key or public key for decryption");
      }
    };

    decryptPreviousMessages();
  }, [messages, friendPublicKey]);

  useEffect(() => {
    socket?.on("messageReceived", async (newMessage) => {
      const { content, iv } = newMessage;

      // Ensure content and iv are defined before proceeding
      if (!content || !iv) {
        console.error(
          "Received message with missing content or iv",
          newMessage
        );
        return; // Exit if either is undefined
      }

      try {
        // Base64 decode the encrypted content and iv
        const encryptedMessageBuffer = Buffer.from(content, "base64");
        const ivBuffer = Buffer.from(iv, "base64");

        // Convert Buffer to Uint8Array (required for Web Crypto API)
        const encryptedMessageArray = new Uint8Array(encryptedMessageBuffer);
        const ivArray = new Uint8Array(ivBuffer);

        // Get private key and friend's public key
        const privateKey = await getPrivateKeyFromLocalStorage();
        const publicKey = await getPublicKey(friendPublicKey);

        if (privateKey && publicKey) {
          const sharedKey = await deriveSharedKey(privateKey, publicKey);
          console.log("Shared Key:", sharedKey); // Log the shared key for debugging

          // Decrypt the message using the shared key
          const decryptedMessage = await decryptMessage(
            sharedKey,
            encryptedMessageArray,
            ivArray
          );

          console.log("Decrypted Message:", decryptedMessage); // Log the decrypted message

          // Update the UI with the decrypted message
          setMessages((prevMessages: any) => [
            ...prevMessages,
            { ...newMessage, content: decryptedMessage },
          ]);
          updateChats(decryptedMessage, chatId);
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
  }, [socket, friendPublicKey, updateChats, chatId]);

  useEffect(() => {
    if (messages.length) {
      messages.forEach((message: any) => {
        if (message.senderId !== userId) {
          socket?.emit("seeMessage", {
            chatId,
            messageId: message.id,
            userId,
          });
        }
      });
    }

    scrollToBottom();
  }, [messages, chatId, userId, socket]);

  useEffect(() => {
    // Listen for message seen updates
    socket?.on("messageSeen", ({ messageId }) => {
      setMessages((prevMessages: any) =>
        prevMessages.map((message: any) =>
          message.id === messageId ? { ...message, seen: true } : message
        )
      );
      resetUnreadMessagesCount(chatId);
    });

    return () => {
      socket?.off("messageSeen");
    };
  }, [socket, resetUnreadMessagesCount, chatId]);

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
