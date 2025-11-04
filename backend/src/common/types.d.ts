import { type JWTPayload } from '@/api/auth/authModel.ts';

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
