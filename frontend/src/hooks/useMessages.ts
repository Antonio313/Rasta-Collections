import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ContactMessage, ApiResponse } from "@rasta/shared";

export function useMessages(unreadOnly = false) {
  return useQuery<ApiResponse<ContactMessage[]>>({
    queryKey: ["admin", "messages", { unreadOnly }],
    queryFn: async () => {
      const params = unreadOnly ? { unread: "true" } : {};
      const res = await api.get("/api/admin/messages", { params });
      return res.data;
    },
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.patch(`/api/admin/messages/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/messages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}
