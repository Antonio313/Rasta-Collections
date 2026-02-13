import { Link } from "react-router-dom";
import { Package, Eye, Star, Mail, Plus, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useProducts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const statCards = [
  { key: "totalProducts" as const, label: "Total Products", icon: Package },
  { key: "visibleProducts" as const, label: "Visible", icon: Eye },
  { key: "featuredProducts" as const, label: "Featured", icon: Star },
  { key: "unreadMessages" as const, label: "Unread Messages", icon: Mail },
];

export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { data, isLoading } = useDashboardStats();
  const stats = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">
                  {stats?.[card.key] ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/categories">
              <FolderOpen className="mr-2 h-4 w-4" />
              Manage Categories
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/messages">
              <Mail className="mr-2 h-4 w-4" />
              View Messages
              {stats?.unreadMessages ? (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {stats.unreadMessages}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
