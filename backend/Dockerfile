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

# Start the application
CMD ["node", "dist/main.js"]
