FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .
COPY ../../config ./config
COPY ../../lib ./lib
COPY ../../middleware ./middleware
COPY ../../models ./models
COPY ../../routes ./routes
COPY ../../services ./services
COPY ../../utils ./utils
COPY ../../types ./types

RUN pnpm run build

CMD [ "node", "dist/user.service.js" ]

EXPOSE 8080