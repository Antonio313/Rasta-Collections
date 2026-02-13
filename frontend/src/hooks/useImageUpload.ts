import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useUploadImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      files,
    }: {
      productId: number;
      files: File[];
    }) => {
      const formData = new FormData();
      formData.append("productId", String(productId));
      files.forEach((file) => formData.append("images", file));

      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: number) => {
      const res = await api.delete("/api/upload", {
        data: { imageId },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useReorderImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageIds: number[]) => {
      const res = await api.patch("/api/upload/reorder", { imageIds });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
