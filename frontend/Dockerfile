# Этап 1: сборка (builder)
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем ВСЕ файлы проекта (включая tsconfig.json, vite.config.js)
COPY . .

# Запускаем сборку (tsc -b && vite build)
RUN npm run build

# Проверяем, что dist создан (диагностика)
RUN ls -la /app/dist

# Этап 2: итоговый образ (Nginx)
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Копируем содержимое dist из builder (не папку, а файлы внутри)
COPY --from=builder /app/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

