# قمرة — Qomra

The official platform for **Qomra Photography Club** (جماعة التصوير الفوتوغرافي) — a university-based photography collective.

## What is Qomra?

Qomra is a bilingual (Arabic/English) web platform that serves as the digital home for the photography club. It showcases members' work, documents events, and connects photographers with opportunities.

### Features

- **Cinematic Gallery** — Full-screen spotlight gallery with scroll-driven animations and an expanding grid of works
- **Events & Activities** — Exhibitions, workshops, and photography trips
- **Qomra Week** — Annual photography week with curated editions
- **Learn** — Educational content and tutorials about photography
- **Services Marketplace** — Members can offer photography, videography, editing, and design services (priced in Omani Rial)
- **Admin Dashboard** — Full CMS for managing all content, members, gallery, events, and settings
- **Bilingual** — Full Arabic (RTL) and English support with locale-based routing
- **Responsive** — Designed for desktop and mobile

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis |
| Backend | Express, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Storage | Cloudflare R2 (S3-compatible) |
| Fonts | Dialogue Me (custom), Playfair Display (numbers), Noto Sans Arabic (Arabic numerals) |

## Project Structure

```
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (locale routing + admin)
│   │   ├── components/    # UI + animation components
│   │   ├── dictionaries/  # ar.json / en.json translations
│   │   └── lib/           # Fonts, API client, utilities
│   └── public/            # Static assets, images, fonts
│
├── server/          # Express backend
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── config/        # DB, R2, env
│       └── middleware/     # Auth, upload
│
└── package.json     # Workspace root
```

## Environment Variables

### Server (`server/.env`)

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-key
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=qomra
R2_PUBLIC_URL=https://pub-xxx.r2.dev
CLIENT_URL=http://localhost:3000
```

## Development

```bash
npm install
npm run dev        # Runs both client (port 3000) and server (port 5000)
```

## Deployment

- **Frontend**: Vercel (Next.js)
- **Backend**: Any Node.js host (Railway, Render, VPS)
- **Database**: MongoDB Atlas
- **Storage**: Cloudflare R2
