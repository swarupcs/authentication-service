# Use Ubuntu + Node 22 just like GitHub Actions
FROM node:22-bullseye

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (same as CI)
RUN npm ci

# Copy source code
COPY . .

# For safety, force consistent locale + encoding
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV NODE_ENV=test

# Run tests directly

# Run the CI test script with extended timeout
CMD ["npm", "run", "test:ci"]
