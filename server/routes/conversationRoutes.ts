import express from "express";
import {
  getAllConversations,
  getConversationDetails,
  searchConversation,
} from "../controllers/conversationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/get-conversations", authMiddleware, getAllConversations);

router.post("/search", authMiddleware, searchConversation);

router.get("/details/:conversationId", authMiddleware, getConversationDetails);

export default router;
