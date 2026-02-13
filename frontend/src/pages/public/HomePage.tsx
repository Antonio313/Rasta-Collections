import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function HomePage() {
  useDocumentTitle();
  const { data, isLoading } = useFeaturedProducts();
  const products = data?.data ?? [];

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-rasta-black">
        {/* Diagonal color stripes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 top-0 h-full w-1/3 -skew-x-12 bg-rasta-red" />
          <div className="absolute left-1/4 top-0 h-full w-1/3 -skew-x-12 bg-rasta-yellow" />
          <div className="absolute right-0 top-0 h-full w-1/3 -skew-x-12 bg-rasta-green" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Rasta Collections"
              className="h-36 w-36 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
            />

            <div className="max-w-2xl">
              {/* Color accent dots */}
              <div className="mb-6 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rasta-red" />
                <span className="h-3 w-3 rounded-full bg-rasta-yellow" />
                <span className="h-3 w-3 rounded-full bg-rasta-green" />
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Rasta{" "}
                <span className="text-rasta-green">Collections</span>
              </h1>
              <p className="mt-4 text-lg text-white/70 sm:text-xl">
                Unique rasta-themed products and collectibles. Browse our
                curated collection of quality items with one love.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-rasta-green hover:bg-rasta-green/90"
                >
                  <Link to="/listings">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Products
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  <Link to="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-rasta-black sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-muted-foreground">
              Hand-picked items from our collection
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/listings">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </section>

      {/* About section */}
      <section className="bg-rasta-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-rasta-black sm:text-3xl">
              About Rasta Collections
            </h2>
            <div className="mx-auto mt-4 flex justify-center gap-1">
              <div className="h-1 w-8 rounded-full bg-rasta-red" />
              <div className="h-1 w-8 rounded-full bg-rasta-yellow" />
              <div className="h-1 w-8 rounded-full bg-rasta-green" />
            </div>
            <p className="mt-6 text-lg leading-relaxed text-rasta-black/70">
              Welcome to Rasta Collections — your one-stop shop for quality
              rasta-themed products and unique collectibles. We take pride in
              curating a selection of items that celebrate the vibrant culture
              and spirit of reggae. Browse our collection online or visit our
              eBay store for even more items.
            </p>
            <Button
              asChild
              className="mt-6 bg-rasta-green hover:bg-rasta-green/90"
            >
              <Link to="/listings">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
