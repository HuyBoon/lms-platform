# 🎮 PlayHub: The Gamified Learning Realm

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://www.prisma.io/)
[![Auth.js v5](https://img.shields.io/badge/Auth-Auth.js_v5-8A2BE2?logo=nextauth)](https://authjs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/CSS-Tailwind_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

**PlayHub** is a high-energy, "sticker-style" Learning Management System (LMS) designed to transform education into an epic adventure. Built with a modern serverless stack, it empowers **Sages** (Teachers) to forge vibrant worlds and **Heroes** (Students) to conquer knowledge through immersive quests.

---

## ✨ The Sage's Administrative Authority (Recent Upgrade)

We've recently empowered teachers with **Absolute Governance** over their realms. Sages can now:
- **Forge and Re-forge**: Fully manage Quest scrolls and Lore capsules with intuitive CRUD interfaces.
- **World Governance**: Command the laws of their realms or invoke the *Void Portal* to collapse a world.
- **Hero Insights**: Monitor student progress through dynamic analytics and enrollment tracking.

---

## 🛠️ The Tech Arcanum (Stack)

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/) for lightning-fast server rendering and nested layouts.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom **Playful Design System** (sticker-shadows, bouncy-hovers, and vibrant HSL palettes).
- **Database**: [Neon (Serverless Postgres)](https://neon.tech/) for scalable, globally distributed data storage.
- **ORM**: [Prisma](https://www.prisma.io/) for type-safe database queries and seamless schema migrations.
- **Authentication**: [Auth.js (v5)](https://authjs.dev/) providing secure Credential and OAuth entry into the realm.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth, interactive transitions.

---

## 🚀 Embarking on the Journey (Setup)

### 1. Invoke Dependencies
```bash
npm install
```

### 2. Configure the Realm (.env)
Create a `.env` file in the root with your magical credentials:
```env
# Database (Neon / Postgres)
DATABASE_URL="postgresql://..."

# Auth.js Secrets
AUTH_SECRET="your-epic-secret"

# Optional: OAuth Credentials
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 3. Materialize the Archives (Database)
Initialize the schema and populate the world with initial Sages and Heroes:
```bash
npx prisma db push
npm run seed
```

### 4. Ignite the Portal (Development)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the world.

---

## 📜 Realm Laws (Commands)

- `npm run dev`: Start the local development portal.
- `npx prisma studio`: Peer into the database records visually.
- `npm run lint`: Audit the scroll quality for potential errors.
- `npm run build`: Compile the realm for production deployment.

---

## 🌍 Directory Lore (Structure)

- `src/app`: The ley lines of our application's routing and layout system.
- `src/components`: The magical artifacts (UI components) used to build the world.
- `src/lib/actions`: Server-side rituals (actions) performed by Sages and Heroes.
- `prisma/`: The ancient scripts defining our database schema and seeding logic.

---

> [!TIP]
> **Pro Tip for Sages**: Use the "Magic Sync" button on your dashboard to instantly align your world's lore with the latest archives.

> [!CAUTION]
> **Warning**: Permanently collapsing a world via the Settings Portal is irreversible. All lore and hero history will be lost to the void.

---

Built with ❤️ by the **PlayHub Team** for the next generation of digital adventurers.
