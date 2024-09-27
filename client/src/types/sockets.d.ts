import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    handshake: {
      query: {
        userId: string;
      };
    };
  }
}
