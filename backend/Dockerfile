FROM node:18-alpine
WORKDIR /app

# Copy from the backend folder specifically
COPY backend/package*.json ./
RUN npm install

# Copy all files from the backend folder
COPY backend/ .

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
