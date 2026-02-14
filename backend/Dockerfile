# Use Node.js as the base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port (Railway uses the PORT env var, but we'll expose 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
