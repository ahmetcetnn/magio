"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard() {
  const router = useRouter();
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.replace('/signin');
      }
    } catch {
      router.replace('/signin');
    }
  }, [router]);
  return null;
}
