import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, string>();

export const onlineStatusHandler = (io: Server, socket: Socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    onlineUsers.set(userId, socket.id);

    // Listen for userActive (tab active)
    socket.on("userActive", () => {
      onlineUsers.set(userId, socket.id);
      io.emit("userStatusUpdated", { userId, isOnline: true });
    });

    // Listen for userInactive (tab inactive)
    socket.on("userInactive", () => {
      onlineUsers.delete(userId);
      io.emit("userStatusUpdated", { userId, isOnline: false });
    });

    // Listen for userOffline (logout)
    socket.on("userOffline", () => {
      onlineUsers.delete(userId);
      io.emit("userStatusUpdated", { userId, isOnline: false });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("userStatusUpdated", { userId, isOnline: false });
    });
  }
};
