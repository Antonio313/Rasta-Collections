import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "./ProductImage";
import { FeaturedBadge } from "./FeaturedBadge";
import type { Product } from "@rasta/shared";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]?.url;

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Featured badge */}
      {product.featured && <FeaturedBadge />}

      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <ProductImage
          src={mainImage}
          alt={product.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge variant="secondary" className="mb-2 text-xs">
          {product.category.name}
        </Badge>
        <h3 className="line-clamp-2 font-semibold text-rasta-black">
          {product.title}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-rasta-green">
            ${product.price.toFixed(2)}
          </span>
          {product.ebayUrl && (
            <a
              href={product.ebayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-rasta-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rasta-green/90"
            >
              View on eBay
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
