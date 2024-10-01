"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-[42px] w-[42px] rounded-full bg-slate-200" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-[250px] rounded-[4px] bg-slate-200" />
        <Skeleton className="h-4 w-[250px] rounded-[4px] bg-slate-200" />
      </div>
    </div>
  );
}
