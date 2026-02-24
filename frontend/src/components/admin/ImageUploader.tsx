import { useCallback, useRef, useState } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadImages, useDeleteImage, useReorderImages } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import type { ProductImage } from "@rasta/shared";

interface ImageUploaderProps {
  productId: number;
  images: ProductImage[];
}

export function ImageUploader({ productId, images }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const uploadImages = useUploadImages();
  const deleteImage = useDeleteImage();
  const reorderImages = useReorderImages();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;

      try {
        await uploadImages.mutateAsync({ productId, files });
        toast.success(`${files.length} image(s) uploaded`);
      } catch {
        toast.error("Failed to upload images");
      }

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [productId, uploadImages]
  );

  const handleDelete = async (imageId: number) => {
    try {
      await deleteImage.mutateAsync(imageId);
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;

    const reordered = [...images];
    const [dragged] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, dragged);

    // Update order immediately via API
    const newIds = reordered.map((img) => img.id);
    reorderImages.mutate(newIds);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Images ({images.length})
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadImages.isPending}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploadImages.isPending ? "Uploading..." : "Upload"}
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

      {images.length === 0 ? (
        <div
          className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground hover:border-gray-400"
          onClick={() => fileInputRef.current?.click()}
        >
          Click to upload product images
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, idx) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-square overflow-hidden rounded-lg border ${
                dragIdx === idx ? "opacity-50" : ""
              }`}
            >
              <img
                src={image.url.startsWith("http") ? image.url : `${apiUrl}${image.url}`}
                alt={`Product image ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
              <div className="absolute left-1 top-1 cursor-grab opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-5 w-5 text-white drop-shadow" />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
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
  );
}
