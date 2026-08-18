import { AuthProvider } from '@/contexts/authProvider';
import { Login } from '@/pages/login';
import { Home } from '@/pages/home';
import { ProtectedRoute } from '@/routes/authProtected';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { beforeEach, describe, expect, it } from 'vitest';

import { server } from '@/test/server';

function renderLogin() {
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
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

describe('Login integration', () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it('logs the user in and navigates to the home page', async () => {
    const user = userEvent.setup();

    renderLogin();
    expect(screen.getByText(/Sign in to Smarkets/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText('Email', {
      selector: 'input',
    });

    const passwordInput = screen.getByLabelText('Password', {
      selector: 'input',
    });

    const continueButton = screen.getByRole('button', {
      name: /continue/i,
    });

    await user.type(emailInput, 'test@example.com');

    await user.type(passwordInput, 'Parisadrb@2003');

    await user.click(continueButton);

    await waitFor(() => {
      expect(localStorage.getItem('smarkets_session_token')).toBe('token');
    });
    console.log('TOKENnn:', localStorage.getItem('smarkets_session_token'));

    expect(await screen.findByText(/Live now/i)).toBeInTheDocument();
  });

  it('shows an error when login fails', async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput = screen.getByLabelText('Email', {
      selector: 'input',
    });

    const passwordInput = screen.getByLabelText('Password', {
      selector: 'input',
    });

    const continueButton = screen.getByRole('button', {
      name: /continue/i,
    });

    await user.type(emailInput, 'wrong@example.com');

    await user.type(passwordInput, 'Parisadrb@200');

    await user.click(continueButton);

    expect(
      await screen.findByText(/Incorrect email or password/i)
    ).toBeInTheDocument();

    expect(localStorage.getItem('smarkets_session_token')).toBeNull();
  });
});
