FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY backend ./backend
RUN npm ci --workspace=backend --workspace=shared
WORKDIR /app/backend
RUN npx prisma generate && npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
