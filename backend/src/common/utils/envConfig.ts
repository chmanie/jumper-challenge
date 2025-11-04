import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

// Load environment specific env vars
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
// Load .env (won't override environment specific ones)
dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  JWT_SECRET: str({ devDefault: testOnly('secret') }),
  ALCHEMY_API_KEY: str(),
  DATABASE_URL: str({ devDefault: testOnly('file:./test.db') }),
});
