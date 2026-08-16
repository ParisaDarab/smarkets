import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './src/App.tsx';
import './src/styles/global.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/authProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
