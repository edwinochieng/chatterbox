import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { Socket } from "socket.io-client";

const useTabActivity = () => {
  const socket = useSocket() as Socket & {
    handshake: { query: { userId: string } };
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && socket) {
        socket.emit("userInactive", {
          userId: socket.handshake?.query?.userId,
        });
      } else if (document.visibilityState === "visible" && socket) {
        socket.emit("userActive", { userId: socket.handshake?.query?.userId });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket]);
};

export default useTabActivity;
