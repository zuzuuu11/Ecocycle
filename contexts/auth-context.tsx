import type { ApiUser } from '@/lib/api';
import {
  apiGetMe,
  apiLogin,
  apiPatchMe,
  apiRecordScan,
  apiRegister,
  getStoredToken,
  setStoredToken,
} from '@/lib/api';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AuthUser = ApiUser;

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, displayName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (partial: { displayName: string }) => Promise<{ error?: string }>;
  recordProductScan: (barcode: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiUser(u: ApiUser): AuthUser {
  return { ...u };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = await getStoredToken();
    if (!token) {
      setUser(null);
      return;
    }
    const { ok, data } = await apiGetMe();
    if (ok && data.user) {
      setUser(mapApiUser(data.user));
    } else {
      await setStoredToken(null);
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getStoredToken();
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }
        const { ok, data } = await apiGetMe();
        if (!cancelled && ok && data.user) {
          setUser(mapApiUser(data.user));
        } else if (!cancelled) {
          await setStoredToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { ok, data } = await apiLogin(email.trim(), password);
    if (!ok || !data.token || !data.user) {
      return { error: typeof data.error === 'string' ? data.error : 'Não foi possível entrar.' };
    }
    await setStoredToken(data.token);
    setUser(mapApiUser(data.user));
    return {};
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const { ok, data } = await apiRegister(email.trim(), password, displayName?.trim());
    if (!ok || !data.token || !data.user) {
      return { error: typeof data.error === 'string' ? data.error : 'Não foi possível registrar.' };
    }
    await setStoredToken(data.token);
    setUser(mapApiUser(data.user));
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await setStoredToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (partial: { displayName: string }) => {
    const { ok, data } = await apiPatchMe(partial.displayName.trim());
    if (!ok || !data.user) {
      return { error: typeof data.error === 'string' ? data.error : 'Erro ao salvar.' };
    }
    setUser(mapApiUser(data.user));
    return {};
  }, []);

  const recordProductScan = useCallback(async (barcode: string) => {
    const token = await getStoredToken();
    if (!token) return;
    const { ok, data } = await apiRecordScan(barcode);
    if (ok && data.user) {
      setUser(mapApiUser(data.user));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      signOut,
      refreshUser,
      updateProfile,
      recordProductScan,
    }),
    [user, ready, login, register, signOut, refreshUser, updateProfile, recordProductScan]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length === 1) {
    return parts[0].toUpperCase();
  }
  return 'U';
}
