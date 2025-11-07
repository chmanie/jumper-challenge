# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `pnpm install`

### Step 2: ⚙️ Environment Configuration

- Obtain an API key from [Alchemy](https://dashboard.alchemy.com/signup)
- **IMPORTANT!** Activate _at least_ the following chains in your [Alchemy dashboard](https://dashboard.alchemy.com/apps/ro8ufoza5azdnxdi/networks): arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, zksync 

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables (specifically the `ALCHEMY_API_KEY`)

### Step 3: 🗃️ Database migration

- Make sure you can run the Prisma CLI in your environment (should be installed via pnpm)
- Then run

    ```bash
    npx prisma migrate deploy
    ```

    in the `backend` directory.

    This should create the necessary tables in a local SQLite database.

### Step 4: 🏃‍♂️ Running the Project

All commands in the `backend` directory:

- Development Mode: `pnpm run dev`, then go to http://localhost:8080/docs to view the API documentation
- Building: `pnpm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `pnpm run build && pnpm run start`

### Running the tests

In order to run the tests, first run the migrations on the test db (we are using the test db to run the integration tests)

```bash
DATABASE_URL="file:./test.db" pnpm prisma migrate deploy
```

Then run the integration tests like so:

```bash
pnpm run test
```

in the `backend` directory.
