"use client";

import { useSocket } from "@/context/SocketContext";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ChatRoom from "./ChatRoom";
import ProfileSidebar from "./ProfileSidebar";

export default function ActiveChat() {
  const activeChat = useSelector((state: RootState) => state.chats.activeChat);
  const chatId = activeChat?.id;

  const socket = useSocket();

  useEffect(() => {
    return () => {
      if (socket && chatId) {
        socket.emit("leaveRoom", { chatId });
      }
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit("joinRoom", { chatId });
    }
  }, [socket, chatId]);
  return (
    <div className="w-full h-screen ">
      <div className="flex flex-row">
        <div className="w-full h-screen ">
          <ChatRoom
            chatId={activeChat!.id}
            friend={activeChat!.friend}
            messages={activeChat!.messages}
          />
        </div>

        <ProfileSidebar friend={activeChat?.friend} />
      </div>
    </div>
  );
}
