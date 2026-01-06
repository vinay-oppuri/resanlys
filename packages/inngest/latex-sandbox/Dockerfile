FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
  curl \
  ca-certificates \
  fontconfig \
  bash

# Install tectonic safely (no assumptions about folder names)
RUN curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz \
  | tar -xz -C /usr/local/bin tectonic \
  && chmod +x /usr/local/bin/tectonic

WORKDIR /app

COPY package.json .
COPY server.js .

RUN npm install --production

EXPOSE 8080

CMD ["node", "server.js"]