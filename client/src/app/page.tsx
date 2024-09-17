"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        router.push("/chats");
      }
    };

    const timeout = setTimeout(() => {
      checkUser();
    }, 3500);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <BounceLoader color="#6A4DFF" />
      </div>
    </div>
  );
}
