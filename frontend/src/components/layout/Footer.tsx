import { Link } from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-rasta-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Rasta Collections" className="h-8 w-8" />
              <span className="text-lg font-bold">
                Rasta <span className="text-rasta-green">Collections</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-white/60">
              Unique rasta-themed products and collectibles. Browse our
              collection or find us on eBay.
            </p>
            {/* Rasta color bar */}
            <div className="mt-4 flex gap-1">
              <div className="h-1 w-8 rounded-full bg-rasta-red" />
              <div className="h-1 w-8 rounded-full bg-rasta-yellow" />
              <div className="h-1 w-8 rounded-full bg-rasta-green" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-white/60 transition-colors hover:text-rasta-green"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/listings"
                  className="text-white/60 transition-colors hover:text-rasta-green"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/60 transition-colors hover:text-rasta-green"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://www.ebay.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-rasta-green"
                >
                  eBay Store
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
              Get in Touch
            </h3>
            <div className="space-y-2 text-sm text-white/60">
              <a
                href="mailto:contact@rastacollections.com"
                className="flex items-center gap-2 transition-colors hover:text-rasta-green"
              >
                <Mail className="h-4 w-4" />
                contact@rastacollections.com
              </a>
              <p className="pt-2">
                Have a question? Use our{" "}
                <Link
                  to="/contact"
                  className="text-rasta-green hover:underline"
                >
                  contact form
                </Link>{" "}
                and we'll get back to you.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Rasta Collections. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
