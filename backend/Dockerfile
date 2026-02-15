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

# Set NODE_ENV
ENV NODE_ENV=production

# Copy package files
COPY backend/package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Copy nest-cli.json and tsconfig for runtime metadata
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig.json ./

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["node", "dist/main"]
