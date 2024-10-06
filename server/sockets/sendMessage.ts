import { Server, Socket } from "socket.io";
import prisma from "../prisma/client";

export const sendMessageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", async ({ senderId, content, chatId }) => {
    try {
      const newMessage = await prisma.message.create({
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
      io.to(chatId).emit("messageReceived", {
        id: newMessage.id,
        senderId,
        content,
        createdAt: newMessage.createdAt,
        seen: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};
