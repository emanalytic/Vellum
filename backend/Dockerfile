FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy all source files
COPY backend/ .

# Build the application
RUN npm run build

# Remove devDependencies to reduce image size (optional - comment out if issues persist)
# RUN npm prune --production

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/main.js"]
