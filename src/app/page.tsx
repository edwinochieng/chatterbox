"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function Home() {
  const session = useSession();
  const user = session.data?.user;

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        router.push("/chats");
      } else {
        router.push("/login");
      }
    };

    const timeout = setTimeout(() => {
      checkUser();
    }, 3500);

    return () => clearTimeout(timeout);
  }, [user, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <BounceLoader color="#b200b2" />
      </div>
    </div>
  );
}
