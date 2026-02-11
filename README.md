# MatchGame 🎮

> **Social matching app for gamers, music lovers, and introverts.**  
> Connect with people who share your true interests in games, music, movies, and anime.

![Status](https://img.shields.io/badge/status-active%20development-brightgreen)
![Version](https://img.shields.io/badge/version-0.5.0-blue)
![Tech](https://img.shields.io/badge/stack-Next.js%20%7C%20Express%20%7C%20Prisma-blueviolet)

---

## 🚀 About

**MatchGame** is a matching platform designed to go beyond superficial swipes. We use real data from your favorite platforms to find meaningful connections.

The algorithm analyzes:
- **Games**: Steam library, playtime, and favorite genres.
- **Music**: Spotify top artists, tracks, and audio features.
- **Anime**: MyAnimeList watchlist and favorites.
- **Movies**: TMDB ratings and favorite films.

Users can browse profiles, see compatibility scores, and match based on shared passions.

---

## ✨ Features

### 🔍 Discovery (New!)
- **Swipe Interface**: Tinder-style card stack to browse potential matches.
- **Smart Recommendations**: Algorithm filters out users you've already seen or blocked.
- **Match System**: Mutual likes create a "Match" and open up the possibility to chat.
- **Rich Profiles**: Cards display bio, location, age, and top favorites (Game/Song/Anime) directly on the front.

### 🎮 Steam Integration
- **Library Sync**: Automatically imports your owned games and playtime hours.
- **Top Picks**: Select your top 5 favorite games to showcase on your profile.

### 🎵 Spotify Integration
- **Taste Profile**: Syncs your top artists and genres.
- **Anthems**: Choose your "Profile Anthem" to play when users view your card.

### 📺 Media Integration (Anime & Movies)
- **MyAnimeList**: Search and add your favorite anime.
- **TMDB**: Showcase your favorite movies and TV shows.

---

## 🛠️ Architecture

This is a **monorepo** managing both frontend and backend:

```
matchgame/
├── apps/
│   ├── backend/          # Express API + Prisma + Postgres/SQLite
│   └── web/              # Next.js 14 (App Router) + Zustand + Framer Motion
├── packages/
│   ├── shared/           # Shared TypeScript types & utilities
│   └── database/         # Prisma Schema & Client
└── pnpm-workspace.yaml
```

### Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion (animations), Lucide Icons.
- **Backend**: Node.js/Express, Prisma ORM, Zod (validation).
- **Database**: SQLite (Dev) / PostgreSQL (Prod).
- **Auth**: JWT with Access/Refresh tokens.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/alexcristofari/Matchgame.git
   cd Matchgame
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Database**
   ```bash
   cd packages/database
   cp .env.example .env  # Configure your DB URL
   npx prisma generate
   npx prisma db push
   # Optional: Seed with test data
   npx prisma db seed
   ```

4. **Run Locally**
   ```bash
   # From root
   pnpm dev
   # Authentication: http://localhost:3000/auth/login
   ```

---

## 📅 Recent Changelog

### Version 0.5.0 - Discovery Update
- **[Feature] Discovery UI**: Implemented `SwipeCard` with drag gestures (Left/Right/Up) using Framer Motion.
- **[Feature] Match Logic**: Backend endpoints for `like`, `pass`, and `superlike`. Mutual likes trigger a match.
- **[Database] New Models**: Added `Like`, `Dislike`, and `Match` models to Prisma schema.
- **[Fix] Integrations**: Fixed dependency issues with `node-fetch` in integration services.
- **[Dev] Seeding**: Added `seed.ts` to populate DB with 5 diverse test users (Gamer, Otaku, Cinephile personas).

### Version 0.4.0 - Integrations
- **[Feature]**: Full Steam and Spotify OAuth flows.
- **[Feature]**: Manual search for Anime (Jikan API) and Movies (TMDB API).

---

## 🔮 Roadmap & Next Steps

### 🚧 Immediate Goals
- [ ] **Messaging System**: Real-time chat for matched users (Socket.io).
- [ ] **Notifications**: In-app alerts for new matches and messages.
- [ ] **Match Strategy**: Refine recommendation algorithm to prioritize shared interests (weighted scoring).

### 📋 Future Plans
- **Mobile App**: React Native version for iOS/Android.
- **Voice Snippets**: Record a 30s audio bio.
- **Group Matching**: Find groups for raid parties or movie nights.
- **Events**: "Looking for Group" posts for specific games/events.

---

## 🔧 Troubleshooting

### Common Issues

1.  **ERR_CONNECTION_REFUSED (Frontend)**
    - Ensure the frontend is running: `pnpm --filter web dev`
    - Check if port 3000 is blocked: `npx kill-port 3000`

2.  **API Connection Failed (Backend)**
    - Ensure backend is running: `pnpm dev:backend`
    - Check port 3001.

3.  **Database Errors (P2021, etc)**
    - Run migrations: `npx prisma db push`
    - Check if SQL Server/Postgres is running.

---

## 👤 Author

**Alex Cristofari**
- GitHub: [@alexcristofari](https://github.com/alexcristofari)

---

## 📄 License
Private Project.
