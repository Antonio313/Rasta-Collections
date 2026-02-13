import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Page Not Found");

  return (
    <div className="flex min-h-screen items-center justify-center bg-rasta-cream px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex justify-center gap-2">
          <span className="h-4 w-4 rounded-full bg-rasta-red" />
          <span className="h-4 w-4 rounded-full bg-rasta-yellow" />
          <span className="h-4 w-4 rounded-full bg-rasta-green" />
        </div>
        <h1 className="text-6xl font-bold text-rasta-green">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-rasta-black">
          Page Not Found
        </h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          asChild
          className="mt-6 bg-rasta-green hover:bg-rasta-green/90"
        >
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
