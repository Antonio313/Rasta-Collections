import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "./ProductImage";
import { FeaturedBadge } from "./FeaturedBadge";
import type { Product } from "@rasta/shared";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]?.url;
  const href = `/listings/${product.slug ?? product.id}`;

  return (
    <Link
      to={href}
      className="group relative block overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
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
        <div className="mt-3">
          <span className="text-lg font-bold text-rasta-green">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
