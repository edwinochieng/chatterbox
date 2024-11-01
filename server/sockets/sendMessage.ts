import { Server, Socket } from "socket.io";
import prisma from "../prisma/client";

export const sendMessageHandler = (io: Server, socket: Socket) => {
  socket.on(
    "sendMessage",
    async ({ recipientId, senderId, content, chatId, iv }) => {
      try {
        const newMessage = await prisma.message.create({
          data: {
            conversationId: chatId,
            senderId,
            content,
            seen: false,
            iv,
          },
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
        });

        io.to(recipientId).emit("newMessageNotification", {
          senderId,
          content,
        });

        io.to(chatId).emit("messageReceived", {
          id: newMessage.id,
          senderId,
          content,
          createdAt: newMessage.createdAt,
          seen: newMessage.seen,
          iv,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    }
  );
};
