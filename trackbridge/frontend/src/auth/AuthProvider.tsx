import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role, UserDto } from '@trackbridge/shared';
import { authApi } from '../api/auth.api';
import { getToken, setToken } from '../api/client';

type Ctx = {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((d: { user: UserDto }) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const d = await authApi.login(email, password);
        setUser(d.user as UserDto);
      },
      logout: async () => {
        await authApi.logout();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth');
  return ctx;
}

export function useRole(): Role | undefined {
  return useAuth().user?.role;
}
