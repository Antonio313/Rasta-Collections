import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/ProductTable";
import { useAdminProducts } from "@/hooks/useProducts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function ProductsPage() {
  useDocumentTitle("Products");
  const { data, isLoading } = useAdminProducts();
  const products = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductTable products={products} isLoading={isLoading} />
    </div>
  );
}
