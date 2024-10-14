import React, { useEffect, useState, createContext, useContext } from "react";
import { useSocket } from "./SocketContext";

interface NotificationContextType {
  isNotificationOn: boolean;
  toggleNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
    const storedNotificationState = localStorage.getItem("notifications");
    if (storedNotificationState) {
      setIsNotificationOn(JSON.parse(storedNotificationState));
    }
  }, []);

  useEffect(() => {
    if (isNotificationOn) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [isNotificationOn]);

  useEffect(() => {
    socket?.on("messageReceived", (data: { message: string }) => {
      if (isNotificationOn && Notification.permission === "granted") {
        new Notification("New Message");
      }
    });

    return () => {
      socket?.off("messageReceived");
    };
  }, [isNotificationOn, socket]);

  const toggleNotification = () => {
    setIsNotificationOn((prevState) => !prevState);
    localStorage.setItem("notifications", JSON.stringify(!isNotificationOn));
  };

  return (
    <NotificationContext.Provider
      value={{ isNotificationOn, toggleNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
