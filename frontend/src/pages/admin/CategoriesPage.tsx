import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function CategoriesPage() {
  useDocumentTitle("Categories");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage product categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryManager />
        </CardContent>
      </Card>
    </div>
  );
}
