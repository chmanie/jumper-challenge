import { jwtVerify, SignJWT } from 'jose';

import { env } from '@/common/utils/envConfig';

import { JwtPayload } from './authModel';

const JWT_EXPIRATION_SECS = 2 * 60 * 60;

const SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: JWT_EXPIRATION_SECS * 1000,
  // domain: env.NODE_ENV === 'production' ? `.${env.HOST}` : 'localhost',
  path: '/',
} as const;

export const generateJWT = async ({ address }: JwtPayload) => {
  return new SignJWT({ address })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRATION_SECS}s`)
    .sign(SECRET);
};

export const verifyJWT = async (token: string) => {
  return jwtVerify<JwtPayload>(token, SECRET);
};
