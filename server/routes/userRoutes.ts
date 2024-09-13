import express from "express";
import {
  updateAccountSettings,
  updateProfileSettings,
  updateProfilePicture,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.put("/account-settings", authMiddleware, updateAccountSettings);

router.put("/profile-settings", authMiddleware, updateProfileSettings);

router.put("/profile-picture", authMiddleware, updateProfilePicture);

export default router;
