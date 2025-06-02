# Dockerfile - Final solution
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Create .npmrc with legacy peer deps
RUN echo "legacy-peer-deps=true" > .npmrc

# Install dependencies
RUN npm install

# Create a temporary directory for source code
RUN mkdir -p /tmp/src

# Copy source code to temp directory first
COPY . /tmp/src/

# Remove node_modules from temp source and copy to app directory
RUN rm -rf /tmp/src/node_modules && \
    cp -r /tmp/src/* . && \
    rm -rf /tmp/src

EXPOSE 3000

CMD ["npm", "run", "dev"]