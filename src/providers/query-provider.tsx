'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

let client: QueryClient | null = null;

function getClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }
  return client;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useMemo(() => getClient(), []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
