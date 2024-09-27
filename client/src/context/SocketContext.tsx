import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const userId = user?.userId;

  useEffect(() => {
    if (isAuthenticated && userId) {
      const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL as string, {
        query: { userId: userId },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated, userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
