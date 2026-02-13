import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [error, setError] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      >
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }

  return (
    <img
      src={`${apiUrl}${src}`}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
}
