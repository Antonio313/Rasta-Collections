import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { visible: true } } } },
      },
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
