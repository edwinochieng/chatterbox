"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
