"use client";
import { useNotification } from "@/context/NotificationContext";
import React from "react";

const NotificationSwitch: React.FC = () => {
  const { isNotificationOn, toggleNotification } = useNotification();
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleNotification}
        className={`relative inline-flex items-center py-1 rounded-full w-12 transition-all ${
          isNotificationOn ? "bg-gray-700 dark:bg-gray-50" : "bg-gray-400"
        }`}
      >
        <span
          className={`inline-block w-5 h-5 transform bg-white dark:bg-gray-900 rounded-full transition-transform ${
            isNotificationOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationSwitch;
