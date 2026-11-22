FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY frontend ./frontend
RUN npm ci --workspace=frontend --workspace=shared
RUN npm run build -w frontend

FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
