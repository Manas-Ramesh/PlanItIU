import type { LoginCredentials } from '@/lib/types';

/**
 * Submit login credentials to the backend. Implement this to call your auth API.
 * On success, the caller may redirect (e.g. to onboarding or dashboard).
 */
export async function submitLogin(_credentials: LoginCredentials): Promise<void> {
  // Replace with backend call, e.g.:
  // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  // if (!res.ok) throw new Error('Login failed');
}
