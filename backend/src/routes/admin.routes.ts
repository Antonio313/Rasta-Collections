import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleVisibility,
  toggleFeatured,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/admin.controller";

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Products
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/products/:id/visibility", toggleVisibility);
router.patch("/products/:id/featured", toggleFeatured);

// Categories
router.get("/categories", getAdminCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Messages
router.get("/messages", getMessages);
router.patch("/messages/:id/read", markMessageRead);
router.delete("/messages/:id", deleteMessage);

export default router;
