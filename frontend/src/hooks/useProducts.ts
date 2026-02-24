import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, PaginatedResponse, ApiResponse, DashboardStats } from "@rasta/shared";
import type { CreateProductInput, UpdateProductInput } from "@rasta/shared";

// ─── Public ───────────────────────────────────────────────────

export function useProducts(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await api.get("/api/products", { params });
      return res.data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await api.get("/api/products/featured");
      return res.data;
    },
  });
}

export function useProduct(id: number | undefined) {
  return useQuery<ApiResponse<Product>>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery<ApiResponse<Product>>({
    queryKey: ["products", "slug", slug],
    queryFn: async () => {
      const res = await api.get(`/api/products/slug/${slug}`);
      return res.data;
    },
    enabled: !!slug,
    retry: false,
  });
}

// ─── Admin ────────────────────────────────────────────────────

export function useAdminProducts() {
  return useQuery<ApiResponse<Product[]>>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const res = await api.get("/api/admin/products");
      return res.data;
    },
  });
}

export function useDashboardStats() {
  return useQuery<ApiResponse<DashboardStats>>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/admin/dashboard");
      return res.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const res = await api.post("/api/admin/products", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProductInput }) => {
      const res = await api.put(`/api/admin/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useToggleVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/api/admin/products/${id}/visibility`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/api/admin/products/${id}/featured`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
