import { Router } from "express";
import { login, logout, refresh } from "../controllers/auth.controller";
import { loginLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
