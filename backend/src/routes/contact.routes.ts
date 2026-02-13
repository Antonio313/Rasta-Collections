import { Router } from "express";
import { submitContactForm } from "../controllers/contact.controller";
import { contactLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", contactLimiter, submitContactForm);

export default router;
