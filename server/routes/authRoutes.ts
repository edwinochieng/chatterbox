import { Router } from "express";
import {
  signup,
  login,
  refreshAccessToken,
} from "../controllers/authController";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/refresh-token", refreshAccessToken);

export default router;
