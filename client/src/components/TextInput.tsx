"use client";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { BsFillSendFill } from "react-icons/bs";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

export default function TextInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const senderId = user?.userId;
  const socket = useSocket();

  const sendMessage = () => {
    if (!message.trim() || !senderId) return;

    socket?.emit("sendMessage", {
      chatId,
      senderId,
      content: message,
    });

    setMessage("");
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
