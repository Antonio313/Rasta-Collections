import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { HomePage } from "@/pages/public/HomePage";
import { ListingsPage } from "@/pages/public/ListingsPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { ProductDetailPage } from "@/pages/public/ProductDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoginPage } from "@/pages/admin/LoginPage";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import { EditProductPage } from "@/pages/admin/EditProductPage";
import { CategoriesPage } from "@/pages/admin/CategoriesPage";
import { MessagesPage } from "@/pages/admin/MessagesPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:slug" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin CMS (protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<EditProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}

export default App;
