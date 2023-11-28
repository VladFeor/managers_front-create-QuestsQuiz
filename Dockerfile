FROM node:16-bullseye-slim AS builder

WORKDIR /opt

COPY package.json package-lock.json .npmrc ./

RUN apt-get update \
    && apt-get install -y git \
    && npm install

COPY . .

ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN npm run build

FROM node:16-bullseye-slim

WORKDIR /opt

COPY --from=builder /opt/.output ./.output

CMD node .output/server/index.mjs
