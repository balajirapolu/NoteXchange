# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package descriptors and install node modules
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and generate production build bundle
COPY . ./
RUN npm run build

# Production stage using lightweight Nginx web server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default Nginx assets
RUN rm -rf ./*

# Copy built distribution assets from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration for SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
