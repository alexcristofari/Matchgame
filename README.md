# MatchGame

> **Social matching app for gamers** — Connect with people who share your taste in games, music, movies, and anime.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node](https://img.shields.io/badge/node-20%2B-green)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)

---

## About

MatchGame is a matching platform designed for gamers and introverts. Instead of matching based on looks, users connect through **shared interests** calculated by an algorithm that analyzes:

- **Games** — Steam library, League of Legends rank, hours played
- **Music** — Spotify top artists and genres
- **Movies/Shows** — TMDB ratings and favorites
- **Anime** — MyAnimeList watchlist
- **Manual Favorites** — Top 3 picks in each category

The algorithm generates a **compatibility score (0-100%)** for each potential match.

---

## Architecture

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

## Tech Stack

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

## Getting Started

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

## Recent Updates

### Steam Integration
- Connect Steam account to import game library and playtime.
- Select favorite games to display on profile.
- Real-time synchronization with Steam API.

### Spotify Integration
- Search and select favorite songs using Spotify API.
- Select favorite genres from official Spotify list.
- Display album art and listen to previews.
- Link to Spotify profile.
- Fallback system for API stability.

### User Profile
- Public profile view with customizable bio and location.
- "Top Pick" game and "Featured Song" embed.
- Visual display of music taste and game history.

---

## Roadmap

### Next Steps
- **Matching Algorithm**: Develop compatibility scoring based on common games and genres.
- **Discovery UI**: Implement swipe/card interface for finding matches.
- **Real-time Chat**: Messaging system with WebSocket (Socket.io).
- **More Integrations**: Add support for MyAnimeList and TMDB.
- **Mobile Responsiveness**: Improve mobile experience for all pages.

---

## Author

**Alex Cristofari**
- GitHub: [@alexcristofari](https://github.com/alexcristofari)

---

## License

This project is private and not licensed for public use.
