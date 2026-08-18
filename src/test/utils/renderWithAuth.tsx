// src/test/utils/renderWithAuth.tsx

import { AuthProvider } from '@/contexts/authProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function renderWithAuth(ui: React.ReactNode, initialEntries = ['/']) {
  localStorage.setItem('smarkets_session_token', 'token');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}
