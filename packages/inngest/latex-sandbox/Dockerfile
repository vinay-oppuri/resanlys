FROM node:20-alpine

RUN apk add --no-cache \
    curl \
    ca-certificates \
    bash \
    fontconfig \
    && curl -L https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz \
    | tar xz -C /usr/local/bin

WORKDIR /app
COPY server.js .
COPY package.json .

RUN npm install

EXPOSE 8080
CMD ["node", "server.js"]