import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilterBar } from "@/components/products/SearchFilterBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function ListingsPage() {
  useDocumentTitle("Products");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [page, setPage] = useState(1);

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, setSearchParams]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [category]);

  const { data, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    category: category || undefined,
    page,
    limit: 12,
  });

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-rasta-black sm:text-3xl">
          {category ? "Filtered Products" : "All Products"}
        </h1>
        {data && (
          <p className="mt-1 text-muted-foreground">
            {data.total} product{data.total !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Search + filter bar */}
      <div className="mb-8">
        <SearchFilterBar
          search={search}
          category={category}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Product grid */}
      <ProductGrid products={products} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
