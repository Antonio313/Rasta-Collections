import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCategories } from "@/hooks/useCategories";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { data } = useCategories();
  const categories = data?.data ?? [];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-rasta-green ${
      isActive ? "text-rasta-green" : "text-rasta-black/80"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Rasta Collections" className="h-8 w-8" />
          <span className="text-lg font-bold text-rasta-black">
            Rasta <span className="text-rasta-green">Collections</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {/* All Products with dropdown */}
          <div className="group relative">
            <NavLink
              to="/listings"
              className={(props) =>
                `${navLinkClass(props)} inline-flex items-center gap-1`
              }
            >
              All Products
              {categories.length > 0 && (
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              )}
            </NavLink>

            {categories.length > 0 && (
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="min-w-44 rounded-md border bg-white py-1 shadow-lg">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/listings?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-rasta-black/80 transition-colors hover:bg-rasta-green/10 hover:text-rasta-green"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              <NavLink
                to="/"
                end
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                Home
              </NavLink>

              {/* All Products with expandable categories */}
              <div>
                <div className="flex items-center justify-between">
                  <NavLink
                    to="/listings"
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass}
                  >
                    All Products
                  </NavLink>
                  {categories.length > 0 && (
                    <button
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className="p-1 text-rasta-black/60"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          categoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {categoriesOpen && categories.length > 0 && (
                  <div className="ml-4 mt-2 flex flex-col gap-2 border-l border-rasta-green/20 pl-3">
                    {categories.map((cat) => (
                      <NavLink
                        key={cat.id}
                        to={`/listings?category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={navLinkClass}
                      >
                        {cat.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass}
              >
                Contact
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
