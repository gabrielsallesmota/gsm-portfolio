# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (node_modules excluded via .dockerignore)
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/dist /app/dist

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "preview"]
