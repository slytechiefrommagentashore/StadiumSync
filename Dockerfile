# Build Stage 1: Build the Vite React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package descriptors and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source code and build for production
COPY frontend/ .
RUN npm run build

# Build Stage 2: Express Backend Server
FROM node:22-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ .

# Copy the built React assets into frontend-facing "public" scope
COPY --from=frontend-builder /app/frontend/dist ./public

# Bind environment configurations globally injected by Cloud Run
ENV PORT=8080
EXPOSE 8080

# Execute server 
CMD ["node", "server.js"]
