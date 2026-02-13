# Rasta Collections

A custom branded e-commerce storefront for [rastacollections.com](https://rastacollections.com) — a business selling coins, rocks, and rasta-themed collectibles via eBay.

The site features a public product catalogue with search, category filtering, and direct eBay purchase links, alongside a password-protected admin CMS for managing products, categories, and customer messages.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite 7 |
| UI Components | Shadcn/UI (Radix UI + Tailwind) |
| State Management | TanStack Query v5, React Hook Form, Zod |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL 18, Prisma ORM |
| Auth | JWT (access + refresh tokens in httpOnly cookies) |
| Image Processing | Sharp (WebP conversion, max 1200px) |
| Deployment | Railway |

## Project Structure

```
rasta-collections/
├── frontend/          # React SPA (port 5173)
├── backend/           # Express API (port 3000)
├── shared/            # Shared Zod schemas & TypeScript types (@rasta/shared)
├── docs/              # User manual
└── package.json       # npm workspaces root
```

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 18 (running locally on port 5432)
- **npm** 9+

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Create a PostgreSQL database:

```bash
createdb -U postgres rastacollections_dev
```

### 3. Configure environment variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/rastacollections_dev
JWT_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=your-different-random-secret-here
PORT=3000
FRONTEND_URL=http://localhost:5173
CONTACT_EMAIL=your-email@example.com
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000
```

### 4. Run database migrations and seed

```bash
cd backend
npx prisma migrate dev
npm run seed
```

This creates the database tables and seeds a default admin user and a "General" category.

### 5. Start development servers

From the project root, in two separate terminals:

```bash
npm run dev:backend    # Express API on http://localhost:3000
npm run dev:frontend   # Vite dev server on http://localhost:5173
```

### 6. Log in to the admin panel

Navigate to http://localhost:5173/admin/login

- **Username:** `admin`
- **Password:** `ChangeMe123!`

## Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero section, featured products, and about section |
| `/listings` | Product catalogue with search, category filter, and pagination |
| `/contact` | Contact information and enquiry form |

The navbar includes a hover dropdown under "All Products" for quick category filtering.

## Admin CMS

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with product/message stats |
| `/admin/products` | Product list with visibility and featured toggles |
| `/admin/products/new` | Create product with inline image upload and category creation |
| `/admin/products/:id/edit` | Edit product details, manage images (drag-to-reorder) |
| `/admin/categories` | Add, rename, and delete categories |
| `/admin/messages` | View and manage customer contact messages |

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/auth/login` | No | Admin login |
| POST | `/auth/logout` | No | Admin logout |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/products` | No | List products (search, filter, paginate) |
| GET | `/products/featured` | No | Featured products (up to 4) |
| GET | `/products/:id` | No | Single product |
| GET | `/categories` | No | List categories with product counts |
| POST | `/contact` | No | Submit contact form |
| GET | `/admin/dashboard` | Yes | Dashboard stats |
| GET | `/admin/products` | Yes | All products (including hidden) |
| POST | `/admin/products` | Yes | Create product |
| PUT | `/admin/products/:id` | Yes | Update product |
| DELETE | `/admin/products/:id` | Yes | Delete product |
| PATCH | `/admin/products/:id/visibility` | Yes | Toggle visibility |
| PATCH | `/admin/products/:id/featured` | Yes | Toggle featured |
| GET | `/admin/categories` | Yes | All categories (admin) |
| POST | `/admin/categories` | Yes | Create category |
| PUT | `/admin/categories/:id` | Yes | Update category |
| DELETE | `/admin/categories/:id` | Yes | Delete category |
| GET | `/admin/messages` | Yes | All contact messages |
| PATCH | `/admin/messages/:id/read` | Yes | Mark message as read |
| DELETE | `/admin/messages/:id` | Yes | Delete message |
| POST | `/upload` | Yes | Upload product images |
| DELETE | `/upload` | Yes | Delete an image |
| PATCH | `/upload/reorder` | Yes | Reorder images |

## Useful Commands

```bash
# Development
npm run dev:backend              # Start backend
npm run dev:frontend             # Start frontend

# Database
cd backend
npx prisma migrate dev           # Run migrations
npx prisma studio                # Visual database browser (localhost:5555)
npm run seed                     # Seed admin user + default category

# Build
cd frontend && npx vite build   # Production frontend build
cd backend && npm run build      # Compile TypeScript
```

## Documentation

- **Admin User Manual:** [`docs/user-manual.md`](docs/user-manual.md) — step-by-step guide for managing the site
- **Project Conventions:** [`CLAUDE.md`](CLAUDE.md) — technical conventions and architecture decisions
