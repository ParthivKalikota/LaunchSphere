import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
