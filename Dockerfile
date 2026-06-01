# --- STAGE 1: Base Image ---
FROM node:20-alpine AS base
WORKDIR /app
# libc6-compat sangat direkomendasikan untuk Next.js di lingkungan Alpine Linux
RUN apk add --no-cache libc6-compat

# --- STAGE 2: Dependencies ---
FROM base AS deps
# Menghapus tanda '*' agar wajib mendeteksi package-lock.json demi keamanan npm ci
COPY package.json package-lock.json ./
RUN npm ci

# --- STAGE 3: Builder ---
FROM base AS builder
COPY . .
# Mengambil node_modules dari stage deps agar proses build Next.js bisa berjalan
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

# --- STAGE 4: Runner (Production) ---
FROM base AS runner
ENV NODE_ENV=production

# Praktik terbaik keamanan: Jangan jalankan container sebagai root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin aset yang diperlukan saja dari stage builder & deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Atur hak akses folder ke user non-root
RUN chown -R nextjs:nodejs /app/.next

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]