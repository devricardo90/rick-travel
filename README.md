
Rick Travel — Modern Travel Booking Platform

This is a modern travel booking platform built with Next.js App Router, focused on performance, scalability, and SEO.
The project includes authentication, protected routes, bookings, an admin dashboard foundation, and a clean UI optimized for real-world production use.

🚀 Tech Stack

Next.js (App Router)

React 19

TypeScript

Turbopack (Stable)

Prisma + PostgreSQL

Better Auth

Tailwind CSS

Server Components & Client Components

Middleware-based Route Protection

SEO-first Architecture

⚡ Performance Highlights
Turbopack (Stable)

This project uses Turbopack, the official Next.js bundler designed for maximum speed.

Benefits:

Up to 5x faster builds

Near-instant local server startup

Lightning-fast Hot Reload

Incremental bundling (only changed files are rebuilt)

Cache Components & Dynamic-by-Default Model

The project follows the Next.js dynamic-by-default rendering model, ensuring fresh data when needed.

Where appropriate, the project explicitly uses:

'use cache'


Advantages:

Faster navigation

Reduced server load

Fine-grained cache control per component

Optimal balance between dynamic content and performance

🧠 Architecture Overview

Server Components by default

Client Components only when required ('use client')

Route protection via Next.js Middleware

Secure API routes

Clean separation between public, authenticated, and admin areas

🔐 Authentication & Authorization

Email & password authentication

Secure session handling with cookies

Protected routes (/reservas, /admin)

Role-based access (USER, ADMIN)

Client-side session awareness via AuthStatus component

📦 Features

Browse available tours

Book tours securely

View personal bookings

Cancel bookings

Admin dashboard foundation

Responsive, accessible UI

SEO-ready pages

Optimized loading & caching

🛠️ Getting Started

Install dependencies:

npm install
# or
yarn
# or
pnpm install


Run the development server:

npm run dev


Open:

http://localhost:3000

🗂️ Project Structure (Simplified)
app/
 ├─ (public)
 ├─ admin/
 ├─ api/
 ├─ login/
 ├─ register/
 ├─ reservas/
 ├─ layout.tsx
 ├─ page.tsx
middleware.ts
prisma/

🌍 SEO & Best Practices

SEO-friendly routing

Metadata-ready pages

Clean semantic HTML

Performance-first rendering strategy

Prepared for robots.ts and sitemap.ts

🚢 Deployment

The project is fully compatible with Vercel and modern Node runtimes.

To deploy:

Push to GitHub

Import into Vercel

Configure environment variables

Deploy 🚀

📌 Status

✔ Core features implemented
✔ Auth & protected routes working
✔ Admin base ready
✔ SEO & performance optimized
🚧 Admin dashboard expansion in progress

📄 License

MIT — feel free to use, adapt, and improve.

Se quiser, no próximo passo eu posso: