import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { productQuerySchema } from "@rasta/shared";
import { AppError, parseId } from "../middleware/error.middleware";

const productInclude = {
  category: true,
  images: { orderBy: { displayOrder: "asc" as const } },
};

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, category, page, limit } = productQuerySchema.parse(
      req.query
    );

    const where: Record<string, unknown> = { visible: true };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = { slug: category };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedProducts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Try to get featured products first
    let products = await prisma.product.findMany({
      where: { featured: true, visible: true },
      include: productInclude,
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Fallback: if no featured products, get 4 newest visible products
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: { visible: true },
        include: productInclude,
        orderBy: { createdAt: "desc" },
        take: 4,
      });
    }

    res.json({ data: products });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, "product ID");

    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    if (!product || !product.visible) {
      throw new AppError(404, "Product not found");
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}
