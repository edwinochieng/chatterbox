import express from "express";
import {
  getAllConversations,
  searchConversation,
} from "../controllers/conversationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/get-conversations", authMiddleware, getAllConversations);

router.post("/search", authMiddleware, searchConversation);

export default router;
