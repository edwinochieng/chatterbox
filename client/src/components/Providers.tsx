"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ChatProvider } from "@/context/ChatContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <ChatProvider>
            <Toaster position="top-center" />
            {children}
          </ChatProvider>
        </QueryClientProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
