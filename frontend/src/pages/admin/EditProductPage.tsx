import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";
import { useUploadImages } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import type { CreateProductInput } from "@rasta/shared";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  useDocumentTitle(isEditing ? "Edit Product" : "Add Product");
  const productId = id ? parseInt(id) : undefined;

  const { data: productData, isLoading } = useProduct(productId);
  const product = productData?.data;

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImages = useUploadImages();

  // For create mode: collect files before product exists
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) {
        setPendingFiles((prev) => [...prev, ...files]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: CreateProductInput) => {
    try {
      if (isEditing && productId) {
        await updateProduct.mutateAsync({ id: productId, data });
        toast.success("Product updated");
      } else {
        const res = await createProduct.mutateAsync(data);
        // Upload pending images if any
        if (res.data?.id && pendingFiles.length > 0) {
          try {
            await uploadImages.mutateAsync({
              productId: res.data.id,
              files: pendingFiles,
            });
            toast.success("Product created with images");
          } catch {
            toast.success("Product created, but some images failed to upload");
          }
        } else {
          toast.success("Product created");
        }
      }
      navigate("/admin/products");
    } catch {
      toast.error(
        isEditing ? "Failed to update product" : "Failed to create product"
      );
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          {isEditing && product && (
            <p className="text-muted-foreground">{product.title}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            isSubmitting={
              createProduct.isPending ||
              updateProduct.isPending ||
              uploadImages.isPending
            }
          />
        </CardContent>

        <Separator />

        {/* Images section */}
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing && productId && product ? (
            <ImageUploader productId={productId} images={product.images} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {pendingFiles.length} file{pendingFiles.length !== 1 ? "s" : ""}{" "}
                  selected
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {pendingFiles.length === 0 ? (
                <div
                  className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground hover:border-gray-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to select product images
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {pendingFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingFile(idx)}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
