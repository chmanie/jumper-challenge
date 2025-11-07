# 🚀 Jumper challenge frontend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `pnpm install`

### Step 2: ⚙️ Environment Configuration

- Obtain a project id from [reown](https://cloud.reown.com/sign-up)

- Create `.env.local`: Copy `.env.local.template` to `.env.local`
- Update `.env`: Fill in necessary environment variables (specifically the `NEXT_PUBLIC_APPKIT_PROJECT_ID`)

### Step 3: 🏃‍♂️ Running the Project

    All commands in the `frontend` directory:

- Development Mode: `pnpm run dev`, then go to http://localhost:3000 to view the app
- Building: `pnpm run build`
- Production Mode: Set `.env.local` to `NODE_ENV="production"` then `pnpm run build && pnpm run start`
