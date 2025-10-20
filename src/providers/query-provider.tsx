'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 1000 * 30, 
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => createClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools initialIsOpen={false} position="bottom" /> : null}
    </QueryClientProvider>
  );
}
