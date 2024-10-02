# Build stage
FROM node:20-alpine AS build

WORKDIR /app

RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts
COPY . .
RUN pnpm run build

# Final stage
FROM nginx:alpine

COPY --chown=nginx:nginx --from=build /app/dist /usr/share/nginx/html
COPY env-config.js.template /usr/share/nginx/html/env-config.js.template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY set-variables.sh /docker-entrypoint.d/99-set-variables.sh
RUN chmod +x /docker-entrypoint.d/99-set-variables.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]