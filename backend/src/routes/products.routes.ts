import { Router } from "express";
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

export default router;
