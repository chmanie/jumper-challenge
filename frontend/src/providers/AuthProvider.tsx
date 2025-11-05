import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { type Address } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { useSignMessage } from 'wagmi';

import { AuthContext } from './AuthContext';
import { makeAPIRequest } from '../app/helpers';

interface Props {
  initialIsAuthenticated: boolean;
}

export const AuthProvider = ({ children, initialIsAuthenticated }: PropsWithChildren<Props>) => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setAuthenticated] = useState(initialIsAuthenticated);
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

      const { nonce } = await makeAPIRequest('/api/auth/nonce');

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

      await makeAPIRequest('/api/auth/login', {
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
      makeAPIRequest('/api/auth/logout', {});
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
