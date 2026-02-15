FROM node:18-alpine
WORKDIR /app

# Copy package files from root relative to build context
COPY backend/package*.json ./
RUN npm install

# Copy source from root relative to build context
COPY backend/ .

RUN npm run build

# Don't hardcode EXPOSE, Railway will handle the port
CMD ["npm", "run", "start:prod"]
