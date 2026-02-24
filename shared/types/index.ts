export interface Product {
  id: number;
  title: string;
  slug: string | null;
  description: string;
  price: number;
  ebayUrl: string | null;
  categoryId: number;
  category: Category;
  featured: boolean;
  visible: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  displayOrder: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalProducts: number;
  visibleProducts: number;
  featuredProducts: number;
  unreadMessages: number;
}
