import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@rasta/shared";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          No products found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
