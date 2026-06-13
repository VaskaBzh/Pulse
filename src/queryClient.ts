import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

console.log(
  '[QueryClient] initialized, staleTime:',
  queryClient.getDefaultOptions().queries?.staleTime,
);
