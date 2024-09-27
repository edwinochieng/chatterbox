import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import friendRoutes from "./routes/friendRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import { sendMessageHandler } from "./sockets/sendMessage";
import { onlineStatusHandler } from "./sockets/onlineStatus";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//routes
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/conversations", conversationRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const chatId = socket.handshake.query.chatId;
  if (chatId) {
    socket.join(chatId);
  }

  sendMessageHandler(io, socket);
  onlineStatusHandler(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
