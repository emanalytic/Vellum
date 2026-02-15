# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm ci

# Copy source and build
COPY backend/ .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["npm", "run", "start:prod"]

