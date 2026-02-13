import { Router, Response, NextFunction } from "express";
import multer from "multer";
import { requireAuth, AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import { processAndSaveImage, deleteImage } from "../services/image.service";
import { AppError } from "../middleware/error.middleware";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// All upload routes require auth
router.use(requireAuth);

// Upload image(s) for a product
router.post(
  "/",
  upload.array("images", 10),
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.body.productId);
      if (isNaN(productId)) throw new AppError(400, "productId is required");

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) throw new AppError(404, "Product not found");

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError(400, "No images provided");
      }

      // Get current max display order
      const maxOrder = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });
      let nextOrder = (maxOrder?.displayOrder ?? -1) + 1;

      const savedImages = [];
      for (const file of files) {
        const url = await processAndSaveImage(
          file.buffer,
          productId,
          file.originalname
        );

        const image = await prisma.productImage.create({
          data: {
            productId,
            url,
            displayOrder: nextOrder++,
          },
        });
        savedImages.push(image);
      }

      res
        .status(201)
        .json({ data: savedImages, message: `${savedImages.length} image(s) uploaded` });
    } catch (err) {
      next(err);
    }
  }
);

// Delete a single image
router.delete(
  "/",
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const imageId = parseInt(req.body.imageId);
      if (isNaN(imageId)) throw new AppError(400, "imageId is required");

      const image = await prisma.productImage.findUnique({
        where: { id: imageId },
      });
      if (!image) throw new AppError(404, "Image not found");

      // Delete file from filesystem
      await deleteImage(image.url);

      // Delete database record
      await prisma.productImage.delete({ where: { id: imageId } });

      res.json({ message: "Image deleted" });
    } catch (err) {
      next(err);
    }
  }
);

// Reorder images for a product
router.patch(
  "/reorder",
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { imageIds } = req.body as { imageIds: number[] };

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        throw new AppError(400, "imageIds array is required");
      }

      // Update display order for each image
      await Promise.all(
        imageIds.map((id, index) =>
          prisma.productImage.update({
            where: { id },
            data: { displayOrder: index },
          })
        )
      );

      res.json({ message: "Image order updated" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
