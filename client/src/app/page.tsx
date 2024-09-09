"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <BounceLoader color="#6A4DFF" />
      </div>
    </div>
  );
}
