# Rasta Collections — Project Context

## What this is
A custom branded website for Clive's eBay business (rastacollections.com).
Public-facing storefront with product listings, category filtering, search,
featured products on homepage, and a contact form.
Password-protected admin CMS for Clive to manage products, categories,
and view contact messages.

## Tech Stack
- Frontend: React 19, TypeScript, TailwindCSS v4, Vite 7
- State/Data: Tanstack Query v5, React Hook Form, Zod
- UI Components: Shadcn/UI (Radix UI + Tailwind)
- Backend: Node.js, Express 4, TypeScript
- ORM: Prisma
- Database: PostgreSQL 18 (local for dev, Railway plugin for prod)
- Image Storage: Local filesystem for dev, AWS S3 for prod (+ Sharp for compression)
- Auth: JWT (access + refresh tokens, httpOnly cookies)
- Deployment: Railway (backend + frontend + DB)

## Monorepo Structure
/frontend  — React app (port 5173 in dev)
/backend   — Express API (port 3000 in dev)
/shared    — Shared Zod schemas and TypeScript types (@rasta/shared workspace)
/docs      — User manual (docs/user-manual.md)

Uses npm workspaces. Shared package is `@rasta/shared`.

## Color Scheme (Rasta Theme)
Public site: Rasta colors — green dominant, red + yellow accents, black + cream neutrals
Admin CMS: Clean, neutral — dark sidebar (#111111), white content area, minimal color use

Custom CSS variables defined in frontend/src/index.css:
  --rasta-red:    #DC2626
  --rasta-yellow: #D97706
  --rasta-green:  #16A34A
  --rasta-black:  #111111
  --rasta-cream:  #FAFAF0

## Key Conventions
- All API routes prefixed with /api
- Images stored locally in /backend/uploads/ during dev, S3 in production
- All images compressed to max 1200px wide, converted to WebP via Sharp
- Helmet configured with `crossOriginResourcePolicy: "cross-origin"` for cross-origin image loading
- JWT access token: 15min expiry. Refresh token: 7 days, httpOnly cookie
- Prisma client imported from @/lib/prisma (singleton pattern)
- Zod schemas live in /shared/schemas — imported by both frontend and backend
- Category slugs are auto-generated from category name (lowercase, hyphenated)
- Use async/await throughout, no .then() chains
- Error handling via centralized Express error middleware
- All API responses follow { data, error, message } shape
- Featured products: show up to 4 on homepage. If none are marked featured,
  fall back to 4 most recently created visible products.
- Functional components only — no class components (except ErrorBoundary)
- Use Tanstack Query for server state — no Redux or Context API for server state
- Page titles set via useDocumentTitle hook (react-helmet-async not compatible with React 19)

## Frontend Architecture
Public pages:
- / (HomePage) — Hero with logo + rasta stripes, featured products, about section
- /listings (ListingsPage) — Search + category filter + paginated product grid
- /contact (ContactPage) — Contact info cards + validated form
- /* (NotFoundPage) — 404 catch-all

Admin pages (behind /admin, protected by ProtectedRoute):
- /admin/login — Login form
- /admin — Dashboard with stats
- /admin/products — Product list with inline toggles
- /admin/products/new — Create product with inline image upload + inline category creation
- /admin/products/:id/edit — Edit product with full ImageUploader (drag-reorder, delete)
- /admin/categories — Category manager
- /admin/messages — Contact message viewer

Navbar: Home | All Products (hover dropdown shows categories) | Contact
ErrorBoundary wraps the entire app for crash recovery.

## Database
- Local: rastacollections_dev (postgresql://postgres:password@localhost:5432/rastacollections_dev)
- Migrations: run `npx prisma migrate dev --name <description>` locally
- Production: Railway runs `prisma migrate deploy` automatically on start
- Seed script: npm run seed (creates default admin user + sample category)
- Admin seed credentials: admin / ChangeMe123!

## Running the project
- Backend: `cd backend && npm run dev` (port 3000)
- Frontend: `cd frontend && npm run dev` (port 5173)
- Both from root: `npm run dev:backend` and `npm run dev:frontend`
- Prisma Studio: `cd backend && npx prisma studio`

## Environment Variables
Backend .env:
  DATABASE_URL=postgresql://postgres:password@localhost:5432/rastacollections_dev
  JWT_SECRET (generate a random string)
  JWT_REFRESH_SECRET (generate a different random string)
  PORT=3000
  FRONTEND_URL=http://localhost:5173
  CONTACT_EMAIL (Clive's email for contact form notifications)
  AWS_ACCESS_KEY_ID (production only)
  AWS_SECRET_ACCESS_KEY (production only)
  AWS_BUCKET_NAME (production only)
  AWS_REGION (production only)

Frontend .env:
  VITE_API_URL=http://localhost:3000

## Do Not
- Do not use Redux or Context API for server state — use Tanstack Query
- Do not write raw SQL — use Prisma client
- Do not store JWT in localStorage — use httpOnly cookies
- Do not commit .env files
- Do not use any component library other than Shadcn
- Do not use class components — functional components only (except ErrorBoundary)
- Do not apply rasta color scheme to the admin CMS
- Do not use .then() chains — use async/await

## Current Status
[x] Phase 1 - Foundation
[x] Phase 2 - Backend API routes
[x] Phase 3 - Admin CMS
[x] Phase 4 - Public Frontend
[x] Phase 5 - Polish & Deploy
[x] Bug fixes - Inline category creation, image upload in create flow, navbar dropdown, hero logo, button contrast fix, Helmet CORS fix
