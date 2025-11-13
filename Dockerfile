FROM node:current-slim

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy workspace structure
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend ./backend

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
WORKDIR /usr/src/app/backend

RUN pnpm exec prisma generate

RUN pnpm run build

EXPOSE 8080

# Simple inline command - no entrypoint file needed
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm run start"]
