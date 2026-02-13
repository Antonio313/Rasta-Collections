import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category, ApiResponse } from "@rasta/shared";
import type { CreateCategoryInput, UpdateCategoryInput } from "@rasta/shared";

export function useCategories() {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });
}

export function useAdminCategories() {
  return useQuery<ApiResponse<Category[]>>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const res = await api.get("/api/admin/categories");
      return res.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const res = await api.post("/api/admin/categories", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCategoryInput }) => {
      const res = await api.put(`/api/admin/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
