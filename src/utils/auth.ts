// Simple authentication utilities
// Note: For production, use proper cryptographic libraries via Cloudflare Workers

// Simple hash function for passwords (using Web Crypto API)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'fitup-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Generate a secure token
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Get expiry date (24 hours from now)
export function getTokenExpiry(): string {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString();
}

// Check if token is expired
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
