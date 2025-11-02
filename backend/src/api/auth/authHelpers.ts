import { jwtVerify, SignJWT } from 'jose';

import { env } from '@/common/utils/envConfig';

import { JwtPayload } from './authModel';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export const generateJWT = async ({ address }: JwtPayload) => {
  return new SignJWT({ address })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
};

export const verifyJWT = async (token: string) => {
  return jwtVerify(token, secret);
};
