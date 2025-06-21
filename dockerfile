# ==========================
# 🔧 Base Stage (comum)
# ==========================
FROM node:22-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

# ==========================
# 👨‍💻 Development Stage
# ==========================
FROM base AS development

ENV NODE_ENV=development

# ✅ Instala dependências com lockfile
RUN yarn install --frozen-lockfile

COPY . .

# 🔥 Opcional: build antecipado se necessário para dev
# (depende do seu framework)
# RUN yarn build

CMD ["yarn", "start:dev"]

# ==========================
# 🏗️ Build Stage
# ==========================
FROM base AS build

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# ==========================
# 🚀 Production Stage
# ==========================
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copia apenas o necessário do build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock

# 🔥 Instala só dependências de produção
RUN yarn install --frozen-lockfile --production

CMD ["node", "dist/main.js"]

# ==========================
# 🧪 Test E2E Stage
# ==========================
FROM build AS test

ENV NODE_ENV=test

# Pode rodar testes unitários, integração ou E2E
CMD ["yarn", "test:e2e"]
