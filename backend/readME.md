# Essenz+ Backend

Backend Node.js/Express pour la gestion des utilisateurs, onboarding dynamique, sessions, et upload d’avatar avec Cloudinary.

---

## 🚀 Fonctionnalités principales

- **Auth & Sessions** : Création, login, vérification email, gestion de sessions multi-device.
- **Onboarding Multi-étapes** :
  - Étape 1 : Prénom & nom (obligatoire)
  - Étape 2 : Âge (obligatoire)
  - Étape 3 : Bio (optionnelle)
  - Étape 4 : Upload avatar (optionnel, Cloudinary)
- **Upload sécurisé** : Upload d’images via Multer (stockage mémoire), validation mimetype, envoi sur Cloudinary.
- **Middlewares** : Auth, gestion d’erreurs, validation, upload, etc.
- **Personnalisation du contenu** : Sélection de catégories d’intérêt (à venir).
- **Prisma ORM** : Gestion des modèles et de la base de données.

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

## Docker & Microservices

### Architecture Microservices
Le backend est organisé en microservices indépendants, chacun avec sa propre configuration Docker.

#### Structure des Services
```bash
backend/
└─ services/
   └─ user/
      ├── Dockerfile
      ├── docker-compose.yml
      ├── package.json
      ├── tsconfig.json
      └── user.service.ts
```

### Configuration Docker

#### Dockerfile (Exemple pour le service User)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json .
COPY tsconfig.json .

# Installation des dépendances
RUN npm install -g pnpm
RUN pnpm install

# Copie le code source
COPY . .

# Compilation
RUN pnpm run build

# Configuration du démarrage
CMD ["node", "dist/user.service.js"]
EXPOSE 8080
```

#### docker-compose.yml
```yaml
services:
  user-service:
    build:
      context: ../../..
      dockerfile: backend/services/user/Dockerfile
    ports:
      - '8080:8080'
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/essenz
      - RESEND_API=${RESEND_API}
      - NODE_ENV=production

  # Service de base de données (optionnel si utilisant une base externe)
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=essenz
    ports:
      - '5432:5432'
```

### Déploiement avec Docker

1. **Build et Lancement**
```bash
# Dans le dossier du service
docker-compose up --build

# Pour une reconstruction forcée
docker-compose up --build --force-recreate
```

2. **Variables d'Environnement**
Les variables sensibles peuvent être définies dans un fichier `.env` ou via des variables d'environnement Docker.

3. **Communication Entre Services**
Les services peuvent communiquer via leurs noms définis dans docker-compose.yml (ex: `http://user-service:8080`)

### Bonnes Pratiques

1. **Indépendance des Services**
   - Chaque service doit avoir son propre package.json
   - Les dépendances communes doivent être gérées via des packages partagés
   - Éviter les imports relatifs vers des dossiers parents

2. **Configuration**
   - Utiliser des variables d'environnement pour la configuration
   - Séparer la configuration de développement et production
   - Documenter toutes les variables nécessaires

3. **Tests**
   - Tester chaque service indépendamment
   - Vérifier la communication entre services
   - Tester les cas d'erreur et de redémarrage

---

## License
MIT © 2025 Essenz+ Team
