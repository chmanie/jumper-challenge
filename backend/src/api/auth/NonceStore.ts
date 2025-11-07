import { generateSiweNonce } from 'viem/siwe';

// In-memory storage for nonces. In production, we should use redis for better performance,
// data retention and automatic expiration
export class NonceStore {
  private nonces: Map<string, number> = new Map();
  private timeout: number = 5 * 60 * 1000;

  private isExpired(t: number) {
    return Date.now() - t > this.timeout;
  }

  public createNonce() {
    const nonce = generateSiweNonce();
    this.nonces.set(nonce, Date.now());
    return nonce;
  }

  public validateNonce(nonce: string) {
    // Clear all expired nonces. We should _not_ do this in production. Just use redis
    for (const [n, t] of this.nonces.entries()) {
      if (this.isExpired(t)) {
        this.nonces.delete(n);
      }
    }

    const createdAt = this.nonces.get(nonce);

    if (!createdAt) {
      // No nonce found
      return false;
    }

    if (this.isExpired(createdAt)) {
      // Nonce expired, invalidate it
      this.nonces.delete(nonce);
      return false;
    }

    // Consume nonce to invalidate it for replay attacks
    this.nonces.delete(nonce);
    return true;
  }
}
