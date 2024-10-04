import { Server, Socket } from "socket.io";
import { markMessageAsSeen } from "../utils/lib";

export const seenMessageHandler = (io: Server, socket: Socket) => {
  socket.on("messageSeen", async ({ messageId, userId, chatId }) => {
    try {
      await markMessageAsSeen(messageId, userId);

      io.to(chatId).emit("messageSeen", { messageId, userId });
    } catch (err) {
      console.error("Error processing message seen:", err);
      socket.emit("error", {
        message: "Could not update message seen status.",
      });
    }
  });
};