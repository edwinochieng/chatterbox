"use client";

import React from "react";
import { PiBellSimpleRingingBold } from "react-icons/pi";
import { Switch } from "@/components/ui/switch";
import MainNavbar from "@/components/MainNavbar";
import { styles } from "@/lib/style";
import NotificationSwitch from "@/components/NotificationSwitch";

export default function NotificationSettings() {
  return (
    <div>
      <MainNavbar
        title="Notifications"
        description="Configure how you receive notifications."
      />
      <div className="pt-12 max-w-[500px]">
        <div className=" py-4 flex items-center space-x-4 rounded-[6px] border p-4 dark:border-gray-400">
          <PiBellSimpleRingingBold size={28} />
          <div className="flex-1 space-y-1">
            <p className="text-lg font-medium leading-none">
              Push Notifications
            </p>
            <p
              className={`text-base text-muted-foreground ${styles.description}`}
            >
              Send notifications to device.
            </p>
          </div>
          <NotificationSwitch />
        </div>
      </div>
    </div>
  );
}
