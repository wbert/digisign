# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY fe/package*.json ./
RUN npm ci --include=dev
COPY fe/. .
RUN npm run build    # outputs to /app/dist

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl

# Copy the config from the root nginx folder
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

