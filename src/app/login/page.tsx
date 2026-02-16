'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { submitLogin } from '@/lib/api/auth';
import type { LoginCredentials } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleUsernameInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleUsernameChange(e.target.value);
    },
    [handleUsernameChange]
  );

  const handlePasswordInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handlePasswordChange(e.target.value);
    },
    [handlePasswordChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const credentials: LoginCredentials = { username, password };
      submitLogin(credentials).then(() => {
        router.push('/onboarding');
      });
    },
    [username, password, router]
  );

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4',
        'bg-background'
      )}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-text-primary"
            aria-label="Planituni home"
          >
            Planituni
          </Link>
          <p className="text-text-secondary text-lg mt-2">
            Find Your Perfect Classes
          </p>
        </div>

        <div
          className={cn(
            'rounded-2xl p-6 shadow-card',
            'bg-surface border border-border-subtle'
          )}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
            Sign in with IU Credentials
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login-username">Username</Label>
              <Input
                id="login-username"
                type="text"
                placeholder="Your IU username"
                value={username}
                onChange={handleUsernameInputChange}
                required
                autoComplete="username"
                aria-required
              />
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Your IU password"
                value={password}
                onChange={handlePasswordInputChange}
                required
                autoComplete="current-password"
                aria-required
              />
            </div>

            <Button type="submit" fullWidth className="py-3 rounded-xl">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-text-muted text-center mt-4">
            By signing in, you agree to use your IU credentials securely
          </p>
        </div>
      </div>
    </div>
  );
}
