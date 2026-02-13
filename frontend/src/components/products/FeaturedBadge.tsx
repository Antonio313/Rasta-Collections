import { Star } from "lucide-react";

export function FeaturedBadge() {
  return (
    <div className="absolute left-0 top-3 z-10 flex items-center gap-1 rounded-r-full bg-rasta-yellow px-3 py-1 text-xs font-semibold text-white shadow-sm">
      <Star className="h-3 w-3 fill-current" />
      Featured
    </div>
  );
}
