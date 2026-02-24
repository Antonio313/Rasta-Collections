import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, ChevronRight, Star, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/products/ProductImage";
import { useProductBySlug } from "@/hooks/useProducts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useProductBySlug(slug);
  const product = data?.data;

  const [activeImage, setActiveImage] = useState(0);

  useDocumentTitle(product?.title ?? "Product");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <Skeleton className="mb-8 h-4 w-64" />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-rasta-black">
          Product Not Found
        </h1>
        <p className="mb-6 text-muted-foreground">
          This product doesn't exist or is no longer available.
        </p>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 rounded-md bg-rasta-green px-5 py-2.5 font-medium text-white transition-colors hover:bg-rasta-green/90"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const images = product.images;
  const mainImageSrc = images[activeImage]?.url ?? images[0]?.url;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/listings" className="transition-colors hover:text-rasta-green">
          All Products
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          to={`/listings?category=${product.category.slug}`}
          className="transition-colors hover:text-rasta-green"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 text-rasta-black">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Left: Image Gallery ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
            <ProductImage
              src={mainImageSrc}
              alt={product.title}
              className="h-full w-full"
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    idx === activeImage
                      ? "border-rasta-green"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <ProductImage
                    src={img.url}
                    alt={`${product.title} image ${idx + 1}`}
                    className="h-full w-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Details ── */}
        <div className="flex flex-col">
          {/* Category + Featured */}
          <div className="mb-3 flex items-center gap-2">
            <Link to={`/listings?category=${product.category.slug}`}>
              <Badge
                variant="secondary"
                className="transition-colors hover:bg-secondary/80"
              >
                {product.category.name}
              </Badge>
            </Link>
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rasta-yellow/10 px-2.5 py-0.5 text-xs font-medium text-rasta-yellow">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight text-rasta-black">
            {product.title}
          </h1>

          {/* Price */}
          <p className="mb-6 text-4xl font-bold text-rasta-green">
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-rasta-black/80">
                {product.description}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto">
            {product.ebayUrl ? (
              <a
                href={product.ebayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rasta-green px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-rasta-green/90 sm:w-auto"
              >
                Purchase on eBay
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-rasta-green px-6 py-3.5 text-base font-semibold text-rasta-green transition-colors hover:bg-rasta-green hover:text-white sm:w-auto"
              >
                Contact to Purchase
                <MessageCircle className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
