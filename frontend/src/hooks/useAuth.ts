import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { LoginInput } from "@rasta/shared";

interface AuthUser {
  id: number;
  username: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await api.post("/api/auth/refresh");
        return res.data.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post("/api/auth/login", data);
      return res.data.data as AuthUser;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
      queryClient.clear();
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
