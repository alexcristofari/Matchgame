# 🎮 MatchGame

> **Social matching app for gamers** — Connect with people who share your taste in games, music, movies, and anime.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node](https://img.shields.io/badge/node-20%2B-green)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)

---

## 📖 About

MatchGame is a Tinder-style matching platform designed for gamers and introverts. Instead of matching based on looks, users connect through **shared interests** calculated by an algorithm that analyzes:

- 🎮 **Games** — Steam library, League of Legends rank, hours played
- 🎵 **Music** — Spotify top artists and genres
- 🎬 **Movies/Shows** — TMDB ratings and favorites
- 📺 **Anime** — MyAnimeList watchlist
- ⭐ **Manual Favorites** — Top 3 picks in each category

The algorithm generates a **compatibility score (0-100%)** for each potential match.

---

## 🏗️ Architecture

This is a **monorepo** using pnpm workspaces:

```
matchgame/
├── apps/
│   ├── backend/          # Express API + Prisma + SQLite
│   └── web/              # Next.js 14 frontend
├── packages/
│   ├── shared/           # Shared TypeScript types
│   └── database/         # Prisma client
└── pnpm-workspace.yaml
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime |
| Express | HTTP server |
| TypeScript | Type safety |
| Prisma | ORM (SQLite for dev) |
| JWT | Authentication |
| Zod | Validation |
| bcrypt | Password hashing |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management |
| Axios | HTTP client |
| Framer Motion | Animations |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/alexcristofari/Matchgame.git
cd Matchgame

# Install dependencies
pnpm install

# Setup database
cd packages/database
npx prisma generate
npx prisma db push
cd ../..
```

### Running Locally

```bash
# Terminal 1 - Backend (port 3001)
cd apps/backend
npx tsx src/server.ts

# Terminal 2 - Frontend (port 3000)
cd apps/web
pnpm dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Get current user |

### Users & Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get user details |
| PATCH | `/api/users/me` | Update user |
| GET | `/api/profiles/me` | Get profile |
| POST | `/api/profiles` | Create profile |
| PATCH | `/api/profiles/me` | Update profile |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server status |

---

## 🎨 Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with background image |
| `/auth/login` | Login form |
| `/auth/register` | Registration form |
| `/dashboard` | User dashboard (protected) |

---

## 🔐 Password Requirements

When registering, passwords must have:
- Minimum 6 characters
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)

Example: `Teste123`

---

## 📁 Project Structure

### Backend (`apps/backend/src/`)
```
├── server.ts              # Express entry point
├── modules/
│   ├── auth/              # Register, login, JWT
│   ├── users/             # User CRUD
│   └── profiles/          # Profile CRUD
└── shared/
    └── middlewares/       # Auth middleware
```

### Frontend (`apps/web/src/`)
```
├── app/
│   ├── page.tsx           # Landing page
│   ├── auth/login/        # Login page
│   ├── auth/register/     # Register page
│   └── dashboard/         # Dashboard page
├── services/
│   └── api.ts             # Axios instance
└── store/
    └── auth.ts            # Zustand auth store
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Monorepo structure
- [x] Authentication (register, login, JWT)
- [x] User & Profile CRUD
- [x] Frontend auth pages
- [x] Dashboard UI

### 🔜 Next Steps
- [ ] Platform integrations (Steam, Spotify, MAL)
- [ ] Favorites system (Top 3 per category)
- [ ] Matching algorithm
- [ ] Swipe/Discovery UI
- [ ] Real-time chat (Socket.io)

---

## 👤 Author

**Alex Cristofari**
- GitHub: [@alexcristofari](https://github.com/alexcristofari)

---

## 📄 License

This project is private and not licensed for public use.
