'use client';

import { useAuth } from '@/lib/auth-context';
import { LoginPage } from '@/components/login-page';
import { redirect } from 'next/navigation';

export default function Home() {
  const { worker } = useAuth();

  if (worker) {
    redirect('/dashboard');
  }

  return <LoginPage />;
}
