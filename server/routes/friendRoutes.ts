import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
  getFriends,
} from "../controllers/friendsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/get-friends", authMiddleware, getFriends);

router.get("/get-requests", authMiddleware, getFriendRequests);

router.post("/send-request", authMiddleware, sendFriendRequest);

router.put("/accept-request/:friendshipId", acceptFriendRequest);

router.delete("/delete-request/:friendshipId", deleteFriendRequest);

export default router;
