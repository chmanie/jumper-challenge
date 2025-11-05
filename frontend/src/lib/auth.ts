import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { Address } from 'viem';

export const getAuthenticationState = async () => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('auth_token');

  if (!tokenCookie?.value) {
    return false;
  }

  return true;
};

export const getLoggedInUser = async (): Promise<{ address: Address } | null> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('auth_token');

  if (!tokenCookie?.value) {
    return null;
  }

  const decodedToken = decodeJwt(tokenCookie.value);

  return { address: decodedToken.address as Address };
};
