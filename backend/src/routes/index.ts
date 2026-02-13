import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import categoriesRoutes from "./categories.routes";
import contactRoutes from "./contact.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/contact", contactRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

export default router;
