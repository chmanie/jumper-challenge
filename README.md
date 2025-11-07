# Jumper challenge

## Prerequisites

Please make sure you have the following installed on your system

- NodeJS 22.x
- pnpm 10.x

## Getting started

There's 2 directories into this repository with a README.md for each of those to have more informations about their respective setup.

### frontend

Classic nextjs implementation with Heroui setup. Please follow the instructions in the corresponding [README.md](./frontend/README.md) to get started.

### backend

Expressjs 5 backend using Prisma as the database ORM. Please follow the instructions in the corresponding [README.md](./backend/README.md) to get started.

### Run everything

After everything is set up, to run both services, do

```bash
pnpm run dev
```

in the root directory of this repository.

## Notes

### NixOS

- To run within NixOS, flake files are provided. Use `direnv` and run
    ```bash
    direnv allow
    ```
  to set up all dependencies.

## Application design considerations

### Build system

- Switched to `pnpm` for better install performance and improved `CLI` developer experience

### Backend

- I decided to support the following chains: arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, zksync as they are well supported by the chosen services and libraries
- API documentation is done via `@asteasolutions/zod-to-openapi`. It does not provide a completely DRY approach to Express routing and API documentation but is a solid trade-off for the scope of this challenge. It provides a way to share validation schemas for requests and responses between the actual validation middleware and the API doc generation
- Adjusted the `ServiceResponseSchema` slightly to allow for literal values of `success` flag and status code.
- Upgraded the Express 5 for improved async route handlers and middleware compatibility
- Moved API docs to /docs and API root to /api for improved error fallback handling
- Replaced validation middleware with `express-zod-safe` to improve typing of resulting `req.body`, `req.params` and `req.query` values
- Adding integration tests the `tokenBalanceService` was omitted as creating mock http handlers for external services felt out of scope for this challenge
- Using viem's SIWE implementation to streamline the API flow and reduce dependencies
- Using a JWT-token-header based approach for stateless authentication and to maximize API compatibility
- Relaxed rate-limiting in the development environment. Can be made more strict using environment variables in production
- For the leaderboard no good trade-off could be found in terms of synergy effects with the existing solution, so a token "diversity" (most different tokens on a chain) approach was used. The "enter leaderboard" route loops through all Alchemy token pages to not have a cap at 100 tokens in the leaderboard

### Frontend

- Went with @reown AppKit wallet solution as Alchemy provided solution was lacking developer UX, documentation and needed either an leaking API key or a separate proxy service
- Switched to HeroUI as it supports TailwindCSS natively and I felt more comfortable with it
- Using a Backend-For-Frontend approach to store cookie data in NextJS for a more seamless and secure (!) authentication workflow
- Opted for an infinite-scroll token balance experience as pagination is supported by Alchemy (in fact, every requests is capped to 100 tokens)
- Leaderboard table is not paginated as it felt out of scope for this challenge
