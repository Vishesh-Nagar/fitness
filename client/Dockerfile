# ── Stage 1: build ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (layer cache-friendly)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build the production bundle
COPY . .
RUN npm run build

# ── Stage 2: runtime (nginx) ────────────────────────────────────
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy Vite build output
COPY --from=builder /app/dist .

# Custom nginx config: proxy /api/* to the gateway
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
