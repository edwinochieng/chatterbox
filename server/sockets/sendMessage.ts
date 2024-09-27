import { Server, Socket } from "socket.io";
import prisma from "../prisma/client";

export const sendMessageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", async (data) => {
    const { chatId, senderId, content } = data;

    try {
      // Save message in database
      const message = await prisma.message.create({
        data: {
          conversationId: chatId,
          senderId,
          content,
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

      // Emit the message to everyone in the conversation
      io.to(chatId).emit("messageReceived", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};
