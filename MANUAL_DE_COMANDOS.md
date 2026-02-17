# MANUAL DE COMANDOS — MatchGame

> Atualizado em: 16/02/2026

---

## Stack Atual

| Camada       | Tecnologia                                         |
|--------------|-----------------------------------------------------|
| Frontend     | Next.js 14 (App Router) + TypeScript + TailwindCSS  |
| Backend      | NestJS + TypeScript                                 |
| Banco        | PostgreSQL via **Supabase** (cloud)                 |
| ORM          | Prisma                                              |
| Autenticação | JWT (bcrypt + jsonwebtoken)                         |
| Real-time    | Socket.io (chat)                                    |
| Deploy       | Vercel (web) + Railway/Render (backend)             |
| Monorepo     | pnpm workspaces                                     |

---

## Comandos Essenciais

Abra **3 terminais separados** na raiz do projeto:

```bash
# Terminal 1 — Backend (NestJS + Prisma)
pnpm dev:backend

# Terminal 2 — Frontend (Next.js)
pnpm --filter web dev

# Terminal 3 — Prisma Studio (visualizar/editar dados)
pnpm db:studio
```

---

## Banco de Dados (Supabase + Prisma)

### Conexão

O projeto usa **Supabase** como banco PostgreSQL na nuvem. As URLs de conexão ficam nos arquivos `.env`:

- `apps/backend/.env` → `DATABASE_URL` (connection pooling, porta 6543)
- `packages/database/.env` → `DATABASE_URL` (conexão direta, porta 5432)

> ⚠️ Nunca compartilhe ou commite os arquivos `.env`. Eles já estão no `.gitignore`.

### Sincronizar Schema com o Banco

Sempre que alterar o `schema.prisma`:

```bash
pnpm db:push
```

### Gerar o Prisma Client

Após mudar o schema, gere o client:

```bash
pnpm db:generate
```

### Visualizar Dados (Prisma Studio)

```bash
pnpm db:studio
```

Abre uma interface gráfica no navegador para ver e editar dados.

### Sincronizar Perfis (Seed/Sync)

Depois de editar `packages/database/profiles.json`:

```bash
cd packages/database
npx tsx sync_master.ts
```

---

## Integrações

O sistema suporta 5 integrações para matching cultural:

| Integração    | API              | Endpoint                                       |
|---------------|------------------|-------------------------------------------------|
| Steam         | Steam Web API    | `PUT /api/integrations/steam`                   |
| Spotify       | Spotify API      | `PUT /api/integrations/spotify`                 |
| MyAnimeList   | Jikan API        | `PUT /api/integrations/anime/manual`            |
| TMDB          | TMDB API         | `PUT /api/integrations/movies`                  |
| Google Books  | Google Books API | `PUT /api/integrations/books`                   |

### Exemplo: Adicionar anime manualmente

```bash
curl -s -X PUT http://localhost:3001/api/integrations/anime/manual ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"favorites\": [{\"title\": \"Naruto\", \"score\": 10, \"imageUrl\": \"url\", \"malUrl\": \"url\"}]}"
```

---

## Limpeza de Dados (SQL — Supabase)

Use o **SQL Editor** do Supabase Dashboard ou um cliente como DBeaver.

### Apagar Usuários com Cascata

```sql
-- 1. Definir quem vai ser apagado
WITH users_to_delete AS (
    SELECT id FROM "User" WHERE email IN ('email@exemplo.com')
)
-- 2. Limpar dependências
DELETE FROM "Dislike" WHERE "fromUserId" IN (SELECT id FROM users_to_delete) OR "toUserId" IN (SELECT id FROM users_to_delete);
DELETE FROM "Like" WHERE "fromUserId" IN (SELECT id FROM users_to_delete) OR "toUserId" IN (SELECT id FROM users_to_delete);
DELETE FROM "Match" WHERE "user1Id" IN (SELECT id FROM users_to_delete) OR "user2Id" IN (SELECT id FROM users_to_delete);
DELETE FROM "Message" WHERE "senderId" IN (SELECT id FROM users_to_delete);
DELETE FROM "Profile" WHERE "userId" IN (SELECT id FROM users_to_delete);
DELETE FROM "User" WHERE id IN (SELECT id FROM users_to_delete);
```

> ⚠️ Supabase usa PostgreSQL — aspas duplas nos nomes de tabela/coluna, sem `@variáveis`.

---

## Organização de Arquivos

```
matchgame/
├── apps/
│   ├── backend/         # NestJS API (porta 3001)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Login, registro, JWT
│   │   │   │   ├── chat/           # Socket.io real-time
│   │   │   │   ├── integrations/   # Steam, Spotify, MAL, TMDB, Books
│   │   │   │   ├── matching/       # Algoritmo de compatibilidade
│   │   │   │   └── users/          # Perfil, likes, matches
│   │   │   └── prisma/             # Prisma module
│   │   └── prisma/
│   │       └── schema.prisma
│   └── web/             # Next.js App (porta 3000)
│       └── src/
│           ├── app/
│           │   ├── auth/           # Login, Register
│           │   ├── dashboard/      # Dashboard principal
│           │   ├── profile/        # Perfil do usuário
│           │   ├── chat/           # Chat real-time
│           │   ├── changelog/      # Histórico de versões
│           │   └── about/          # Manifesto / Sobre
│           ├── components/         # Componentes reutilizáveis
│           └── services/           # API client (axios)
├── packages/
│   └── database/        # Prisma schema + seeds + sync
│       ├── profiles.json
│       └── sync_master.ts
└── MANUAL_DE_COMANDOS.md
```

---

## Git

```bash
# Status
git status

# Commit tudo
git add .
git commit -m "mensagem"
git push origin main
```

> Antes de commitar, sempre confira que `.env` NÃO aparece no `git status`.
