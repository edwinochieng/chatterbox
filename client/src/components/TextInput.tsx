"use client";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { BsFillSendFill } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  deriveSharedKey,
  encryptMessage,
  getPrivateKeyFromLocalStorage,
  getPublicKey,
} from "@/lib/encryption";

export default function TextInput({
  chatId,
  friendId,
  friendPublicKey,
}: {
  chatId: string;
  friendId: string;
  friendPublicKey: string;
}) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const senderId = user?.userId;
  const socket = useSocket();

  const sendMessage = async () => {
    if (!message.trim() || !senderId || !friendPublicKey) {
      return;
    }
    const privateKey = await getPrivateKeyFromLocalStorage();
    const publicKey = await getPublicKey(friendPublicKey);
    if (publicKey && privateKey) {
      const sharedKey = await deriveSharedKey(privateKey, publicKey);
      const { encryptedMessage, iv } = await encryptMessage(sharedKey, message);

      const base64EncryptedMessage =
        Buffer.from(encryptedMessage).toString("base64");
      const base64Iv = Buffer.from(iv).toString("base64");

      // Emit the message via Socket.IO, sending base64 strings
      socket?.emit("sendMessage", {
        chatId,
        senderId,
        recipientId: friendId,
        content: base64EncryptedMessage, // Send the base64-encoded encrypted message
        iv: base64Iv, // Send the base64-encoded IV
      });
      setMessage("");
    }
  };

  return (
    <div className="flex items-center border rounded-2xl py-2 px-4">
      <TextareaAutosize
        value={message}
        placeholder="Type a message..."
        className="w-full p-4 text-xl outline-none resize-none overflow-y-auto hidden-scrollbar mr-3 bg-transparent"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        maxRows={5}
        aria-label="Chat message input"
      />
      <div
        className="cursor-pointer"
        onClick={sendMessage}
        aria-label="Send message"
      >
        <BsFillSendFill size={28} className="text-accentBg" />
      </div>
    </div>
  );
}
