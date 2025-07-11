# Essenz+ Backend

## Overview
Essenz+ backend is a robust, type-safe Node.js API built with **TypeScript**, **Express** and **Prisma ORM**. It handles authentication, user management and transactional email with Resend.

Key features:
- Modern TypeScript configuration (strict mode, path aliases).
- Express HTTP server with modular routing & controllers.
- PostgreSQL database accessed via Prisma Client.
- Secure user registration flow with hashed passwords, email-verification tokens and role management.
- Transactional emails sent through Resend.
- Centralised validation via **Yup** validators.
- Comprehensive ESLint + Prettier setup for consistent code style.

---

## Directory Structure
```
backend/
├─ config/              # Environment & app-level configuration
├─ controllers/         # Request controllers (e.g. auth.controller.ts)
├─ mail/                # Email helpers (Resend integration)
├─ middlewares/         # Express middlewares (error handler, auth, etc.)
├─ prisma/              # Prisma schema & migrations
├─ routes/              # Express routers (e.g. user.route.ts)
├─ services/            # Business-logic services (e.g. user.service.ts)
├─ templates/           # Email HTML templates
├─ types/               # Global TypeScript types & enums
├─ validators/          # Yup schemas for request validation
├─ utils/               # Reusable helpers
└─ index.ts             # App entry-point
```

---

## Tech Stack
| Layer              | Technology |
|--------------------|------------|
| Language           | TypeScript (ES2020 target) |
| Runtime            | Node.js 20+ |
| Framework          | Express 4.x |
| ORM / DB toolkit   | Prisma ORM (PostgreSQL) |
| Database           | PostgreSQL 15+ |
| Email service      | Resend |
| Validation         | Yup |
| Auth / Crypto      | bcrypt, crypto (Node stdlib) |
| Tooling            | pnpm (package manager), ts-node-dev, ESLint, Prettier |

---

## Getting Started
### Prerequisites
1. **Node.js** v20 or newer
2. **pnpm** (recommended) or npm / yarn
3. **PostgreSQL** running locally or accessible via connection string
4. **Resend** account & API key

### 1. Clone & Install
```bash
pnpm install
```

### 2. Environment Variables
Create `.env` (or `.env.local`) at `backend/` root using the template below:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
RESEND_API="re_********************************"
APP_URL="http://localhost:3000"   # Frontend URL for email links
NODE_ENV="development"
```

### 3. Prisma Database Setup
```bash
# Generate client
pnpm prisma generate

# Apply existing migrations (or create the first one)
pnpm prisma migrate dev --name init
```

### 4. Run in Development
```bash
pnpm dev   # ts-node-dev with auto-reload
```
API will be available at `http://localhost:4000` (configurable in `index.ts`).

### 5. Build for Production
```bash
pnpm build  # tsc -> dist/
```

---

## Important Scripts (package.json)
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot-reload |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run compiled JS in production |
| `pnpm lint` | Run ESLint checks |
| `pnpm format` | Format with Prettier |
| `pnpm prisma:migrate` | Run `prisma migrate dev` |
| `pnpm prisma:studio` | Open Prisma Studio UI |

---

## Coding Standards
### ESLint & Prettier
- Config files: `.eslintrc.js`, `.prettierrc`, `eslint.config.mjs`.
- AirBnB-style rules with TypeScript plugin.
- **Fix:** `pnpm lint --fix`.

### Commit Message Convention
We recommend [Conventional Commits](https://www.conventionalcommits.org/) to keep a readable Git history.

### Cursor-rule (EditorConfig)
To ensure consistent indentation & line endings across IDEs, `.editorconfig` is provided (add if missing). Most editors support it natively or via plugin.

---

## API Reference
### POST /api/v1/users/register
Registers new user and sends verification email.
```
Body (JSON):
{
  "username": "jdoe",
  "email": "john@doe.com",
  "password": "Str0ngP@ss!"
}
```
Response `201 Created`
```
{
  "message": "User created, verification email sent"
}
```
After verifying `/auth/verify?token=123456&email=john@doe.com`, the user may log in.

---

## Deployment
1. Set `NODE_ENV=production`.
2. Ensure `DATABASE_URL` & `RESEND_API` are set.
3. Run `pnpm build && pnpm start`.
4. Handle graceful shutdown signals to call `prisma.$disconnect()` (already managed in `index.ts`).

---

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| `prepared statement "sX" already exists` | Multiple PrismaClient instances during dev reload | Uses singleton `lib/prisma.ts` – ensure all imports reference this file |
| Email not sent | Invalid Resend key or domain | Check `RESEND_API` and sender domain in `mail/resend.ts` |
| Path alias unresolved | TS path mis-config | Ensure `tsconfig.json` paths + `baseUrl` as shown above |

---

## License
MIT © 2025 Essenz+ Team
