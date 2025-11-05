import { jwtVerify, SignJWT } from 'jose';

import { env } from '@/common/utils/envConfig';

import { JwtPayload } from './authModel';

const JWT_EXPIRATION_SECS = 24 * 60 * 60;

const SECRET = new TextEncoder().encode(env.JWT_SECRET);

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
