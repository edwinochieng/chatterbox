"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const { user, currentUser, setCurrentUser } = useAuth();
  const userId = user?.userId;

  const { data: fetchedUser, isSuccess } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!userId) return null;
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-user?userId=${userId}`
      );
      return result.data;
    },
    enabled: !!userId, // Only run query if userId is available
  });

  useEffect(() => {
    const checkUser = () => {
      if (!currentUser) {
        router.push("/login");
      } else {
        router.push("/chats");
      }
    };

    if (isSuccess && fetchedUser) {
      setCurrentUser(fetchedUser);
      checkUser();
    } else if (!userId) {
      router.push("/login");
    }
  }, [userId, isSuccess, fetchedUser, currentUser, router, setCurrentUser]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <BounceLoader color="#6A4DFF" />
      </div>
    </div>
  );
}
