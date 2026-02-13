import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProductSchema, type CreateProductInput } from "@rasta/shared";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminCategories, useCreateCategory } from "@/hooks/useCategories";
import { toast } from "sonner";
import type { Product } from "@rasta/shared";

type FormValues = z.output<typeof createProductSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const { data: categoriesData } = useAdminCategories();
  const categories = categoriesData?.data ?? [];
  const createCategory = useCreateCategory();

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      ebayUrl: product?.ebayUrl ?? "",
      categoryId: product?.categoryId ?? 0,
      featured: product?.featured ?? false,
      visible: product?.visible ?? true,
    },
  });

  const featured = watch("featured");
  const visible = watch("visible");

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await createCategory.mutateAsync({ name: newCategoryName.trim() });
      toast.success("Category created");
      setValue("categoryId", res.data.id);
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to create category";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Category *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => setShowNewCategory(!showNewCategory)}
            >
              <Plus className="mr-1 h-3 w-3" />
              New
            </Button>
          </div>

          {showNewCategory && (
            <div className="flex gap-2">
              <Input
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateCategory();
                  }
                  if (e.key === "Escape") setShowNewCategory(false);
                }}
                autoFocus
              />
              <Button
                type="button"
                size="sm"
                disabled={createCategory.isPending}
                onClick={handleCreateCategory}
                className="bg-[#111111] hover:bg-[#222222]"
              >
                {createCategory.isPending ? "..." : "Add"}
              </Button>
            </div>
          )}

          <Select
            value={watch("categoryId") ? String(watch("categoryId")) : ""}
            onValueChange={(val) => setValue("categoryId", parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {/* eBay URL */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ebayUrl">eBay URL</Label>
          <Input
            id="ebayUrl"
            type="url"
            placeholder="https://www.ebay.co.uk/itm/..."
            {...register("ebayUrl")}
          />
          {errors.ebayUrl && (
            <p className="text-sm text-red-600">{errors.ebayUrl.message}</p>
          )}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 md:col-span-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={featured}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <Label>Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={visible}
              onCheckedChange={(checked) => setValue("visible", checked)}
            />
            <Label>Visible</Label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#111111] hover:bg-[#222222]"
      >
        {isSubmitting
          ? "Saving..."
          : product
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}
