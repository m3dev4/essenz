FROM node:20-alpine

WORKDIR /app

# Copier le package.json du service user
COPY services/user/package*.json ./
COPY services/user/tsconfig.json ./

RUN npm install -g pnpm
RUN pnpm install

# Copier tout le backend
COPY . .

RUN pnpm run prisma:generate

# Rester dans /app et compiler les fichiers du service
RUN pnpm run build

CMD [ "node", "dist/user.service.js" ]
EXPOSE 8080
