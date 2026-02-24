import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Eye, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  useToggleVisibility,
  useToggleFeatured,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { toast } from "sonner";
import type { Product } from "@rasta/shared";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductTable({ products, isLoading }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const toggleVisibility = useToggleVisibility();
  const toggleFeatured = useToggleFeatured();
  const deleteProduct = useDeleteProduct();

  const handleToggleVisibility = async (id: number) => {
    try {
      const res = await toggleVisibility.mutateAsync(id);
      toast.success(res.message);
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await toggleFeatured.mutateAsync(id);
      toast.success(res.message);
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No products yet. Add your first product to get started.
      </div>
    );
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-20 text-center">
                <Star className="mx-auto h-4 w-4" />
              </TableHead>
              <TableHead className="w-20 text-center">
                <Eye className="mx-auto h-4 w-4" />
              </TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url.startsWith("http") ? product.images[0].url : `${apiUrl}${product.images[0].url}`}
                      alt={product.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{product.category.name}</Badge>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={product.featured}
                    onCheckedChange={() => handleToggleFeatured(product.id)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={product.visible}
                    onCheckedChange={() => handleToggleVisibility(product.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </>
  );
}
