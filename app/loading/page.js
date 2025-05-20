"use client";

/*
 * HALAMAN INI TIDAK DIGUNAKAN LAGI
 * Loading screen telah diintegrasikan langsung ke halaman home
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Loading() {
  const router = useRouter();

  useEffect(() => {
    // Redirect langsung ke home
    router.push('/home');
  }, [router]);

  return null;
} 