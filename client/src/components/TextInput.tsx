"use client";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { BsFillSendFill } from "react-icons/bs";

export default function TextInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  return (
    <div className="flex items-center border rounded-2xl py-2 px-4">
      <TextareaAutosize
        value={message}
        placeholder="Type a message..."
        className="w-full p-4 text-xl outline-none resize-none overflow-y-auto hidden-scrollbar mr-3"
        onChange={(e) => setMessage(e.target.value)}
        maxRows={5}
      />
      <div className="cursor-pointer">
        <BsFillSendFill size={28} className="text-accentBg" />
      </div>
    </div>
  );
}
