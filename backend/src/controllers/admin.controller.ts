import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  updateCategorySchema,
} from "@rasta/shared";
import { AppError, parseId } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import slugify from "slugify";

const productInclude = {
  category: true,
  images: { orderBy: { displayOrder: "asc" as const } },
};

// ─── Dashboard ────────────────────────────────────────────────

export async function getDashboardStats(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [totalProducts, visibleProducts, featuredProducts, unreadMessages] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { visible: true } }),
        prisma.product.count({ where: { featured: true } }),
        prisma.contactMessage.count({ where: { read: false } }),
      ]);

    res.json({
      data: { totalProducts, visibleProducts, featuredProducts, unreadMessages },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Products ─────────────────────────────────────────────────

export async function getAllProducts(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const products = await prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = createProductSchema.parse(req.body);

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new AppError(400, "Category not found");
    }

    const product = await prisma.product.create({
      data,
      include: productInclude,
    });

    res.status(201).json({ data: product, message: "Product created" });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "product ID");
    const data = updateProductSchema.parse(req.body);

    // Verify category exists if categoryId is being updated
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw new AppError(400, "Category not found");
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });

    res.json({ data: product, message: "Product updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "product ID");
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

export async function toggleVisibility(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "product ID");

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError(404, "Product not found");

    const updated = await prisma.product.update({
      where: { id },
      data: { visible: !product.visible },
      include: productInclude,
    });

    res.json({ data: updated, message: `Product ${updated.visible ? "shown" : "hidden"}` });
  } catch (err) {
    next(err);
  }
}

export async function toggleFeatured(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "product ID");

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError(404, "Product not found");

    const updated = await prisma.product.update({
      where: { id },
      data: { featured: !product.featured },
      include: productInclude,
    });

    res.json({
      data: updated,
      message: `Product ${updated.featured ? "featured" : "unfeatured"}`,
    });
  } catch (err) {
    next(err);
  }
}

// ─── Categories ───────────────────────────────────────────────

export async function getAdminCategories(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });

    const data = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: cat._count.products,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = createCategorySchema.parse(req.body);
    const slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError(409, "A category with this name already exists");
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    res.status(201).json({ data: category, message: "Category created" });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "category ID");
    const { name } = updateCategorySchema.parse(req.body);
    const slug = slugify(name, { lower: true, strict: true });

    // Check for duplicate slug (excluding current category)
    const existing = await prisma.category.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      throw new AppError(409, "A category with this name already exists");
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    res.json({ data: category, message: "Category updated" });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "category ID");

    // Check if products are assigned to this category
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new AppError(
        409,
        `Cannot delete: ${productCount} product(s) are assigned to this category`
      );
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
}

// ─── Messages ─────────────────────────────────────────────────

export async function getMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const unreadOnly = req.query.unread === "true";
    const where = unreadOnly ? { read: false } : {};

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ data: messages });
  } catch (err) {
    next(err);
  }
}

export async function markMessageRead(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "message ID");

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    res.json({ data: message, message: "Message marked as read" });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "message ID");
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
}
