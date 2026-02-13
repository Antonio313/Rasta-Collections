import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@rasta/shared";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";

export function LoginPage() {
  useDocumentTitle("Admin Login");
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError, isAuthenticated, isLoading } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      navigate("/admin", { replace: true });
    } catch {
      // Error is handled by loginError
    }
  };

  const apiError = (() => {
    if (!loginError) return null;
    const err = loginError as unknown as { response?: { data?: { error?: string } } };
    return err.response?.data?.error ?? "Login failed";
  })();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#111111]">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>Rasta Collections CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {loginError && (
              <p className="text-sm text-red-600">{apiError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#111111] hover:bg-[#222222]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
