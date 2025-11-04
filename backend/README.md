# 🚀 Jumper challenge backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `npm install`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

### Running the tests

In order to run the tests, first run the migrations on the test db (we are using the test db to run the integration tests)

```bash
DATABASE_URL="file:./test.db" pnpm prisma migrate deploy
```
