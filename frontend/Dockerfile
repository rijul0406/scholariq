# Multi-stage build: "build" stage compiles the app, "serve" stage runs it.

# ---- Stage 1: build the static files with Node ----
FROM node:22-slim AS build
WORKDIR /app

# Install deps first (cached unless package files change).
COPY package.json package-lock.json ./
RUN npm ci

# Build the production bundle -> creates /app/dist.
COPY . .
RUN npm run build

# ---- Stage 2: serve the static files with nginx ----
FROM nginx:alpine
# Copy ONLY the built output from stage 1 (no Node, no node_modules).
COPY --from=build /app/dist /usr/share/nginx/html
# Custom config so client-side routes (/goals, /analytics) work on refresh.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
