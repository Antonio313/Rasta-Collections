import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@rasta/shared";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { toast } from "sonner";

export function CategoryManager() {
  const { data, isLoading } = useAdminCategories();
  const categories = data?.data ?? [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
  });

  const onCreateSubmit = async (data: CreateCategoryInput) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success("Category created");
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to create category";
      toast.error(msg);
    }
  };

  const handleEdit = async (id: number) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory.mutateAsync({ id, data: { name: editingName } });
      toast.success("Category updated");
      setEditingId(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to update category";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast.success("Category deleted");
      setDeleteId(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Failed to delete category";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add new category form */}
      <form
        onSubmit={handleSubmit(onCreateSubmit)}
        className="flex gap-2"
      >
        <div className="flex-1">
          <Input
            placeholder="New category name..."
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={createCategory.isPending}
          className="bg-[#111111] hover:bg-[#222222]"
        >
          {createCategory.isPending ? "Adding..." : "Add"}
        </Button>
      </form>

      {/* Category list */}
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No categories yet.
        </div>
      ) : (
        <div className="divide-y rounded-md border">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              {editingId === cat.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(cat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(cat.id)}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <Badge variant="secondary">
                    {cat.productCount} product{cat.productCount !== 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Categories with products cannot be deleted."
        onConfirm={handleDelete}
        loading={deleteCategory.isPending}
      />
    </div>
  );
}
