import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { createSiweMessage } from 'viem/siwe';
import { useRouter } from 'next/navigation';

import { AuthContext } from './AuthContext';
import { useSignMessage } from 'wagmi';
import { makeAPIRequest } from '../app/helpers';
import { Address } from 'viem';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wasConnected = useRef(isConnected);
  const router = useRouter();

  // FIXME: Error handling. Maybe just reset state and use toast errors

  const signIn = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!address || !chainId) {
        // Unlikely if isConnected is true
        throw new Error('Wallet address or chainId missing');
      }

      try {
        const { me } = await makeAPIRequest('/auth/me');
        if (me) {
          setLoading(false);
          setAuthenticated(true);
          return;
        }
      } catch {
        // If user is not authenticated, just continue with the rest of the flow
      }

      const { nonce } = await makeAPIRequest('/auth/nonce');

      const message = createSiweMessage({
        domain: window.location.host,
        address: address as Address,
        statement: 'Sign in with Ethereum to Balancr.',
        uri: window.location.origin,
        version: '1',
        chainId: Number(chainId),
        nonce,
      });

      const signature = await signMessageAsync({ message, account: address as Address });

      await makeAPIRequest('/auth/verify', {
        message,
        signature,
      });

      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError('Error while trying to sign in');
    } finally {
      setLoading(false);
    }
  }, [address, chainId, signMessageAsync]);

  // Log out when user changes address or disconnects the wallet
  useEffect(() => {
    // Only log out when user was connected before
    if (wasConnected.current) {
      makeAPIRequest('/auth/logout', {});
      setAuthenticated(false);
      setError(null);
      router.push('/');
    }
    wasConnected.current = isConnected;
  }, [address, isConnected, router]);

  useEffect(() => {
    if (isConnected && !isAuthenticated && !isLoading && !error) {
      signIn();
    }
  }, [isConnected, isAuthenticated, isLoading, error, signIn]);

  return <AuthContext.Provider value={{ isAuthenticated, isLoading }}>{children}</AuthContext.Provider>;
};
