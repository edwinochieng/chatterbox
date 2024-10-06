import { Socket } from "socket.io";

export const joinRoomHandler = (socket: Socket) => {
  socket.on("leaveRoom", ({ chatId }) => {
    socket.leave(chatId); // Remove the user from the previous room
    console.log(`User with socket ID ${socket.id} left room: ${chatId}`);
  });

  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId); //join new room
    console.log(`User with socket ID ${socket.id} joined room: ${chatId}`);
  });
};
