import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional().default(""),
  price: z.number().positive("Price must be positive").multipleOf(0.01),
  ebayUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categoryId: z.number().int().positive("Category is required"),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
