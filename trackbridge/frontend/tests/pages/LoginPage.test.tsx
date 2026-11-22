import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../../src/pages/LoginPage';
import { AuthProvider } from '../../src/auth/AuthProvider';

vi.mock('../../src/api/auth.api', () => ({
  authApi: { login: vi.fn(), me: vi.fn(), logout: vi.fn() },
}));

describe('LoginPage', () => {
  it('shows TrackBridge, CBTP, and six demo roles', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('TrackBridge')).toBeInTheDocument();
    expect(screen.getByText(/CBTP/)).toBeInTheDocument();
    expect(screen.getByText(/Administrator:/)).toBeInTheDocument();
    expect(screen.getByText(/Host organisation:/)).toBeInTheDocument();
  });
});
