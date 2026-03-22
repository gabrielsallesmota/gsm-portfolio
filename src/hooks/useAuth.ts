import { useState, useEffect } from 'react';
import { apiRequest, clearToken, getToken, setToken } from '@/lib/api';
import type { AuthUser } from '@/types/crm';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      if (!payload?.user_id || !payload?.email) {
        clearToken();
        setLoading(false);
        return;
      }
      setSession({ access_token: token });
      setUser({ id: payload.user_id, email: payload.email });
    } catch {
      clearToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const body = new URLSearchParams();
      body.set('username', email);
      body.set('password', password);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ detail: 'Erro de login' }));
        return { error: { message: data.detail || 'Erro de login' } };
      }

      const data = (await response.json()) as { access_token: string };
      setToken(data.access_token);

      const payloadBase64 = data.access_token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      setSession(data);
      setUser({ id: payload.user_id, email: payload.email });
      return { error: null };
    } catch {
      return { error: { message: 'Erro ao conectar com o backend' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await apiRequest('/auth/signup', {
        method: 'POST',
        body: {
          name: email.split('@')[0],
          email,
          password,
        },
      });
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      return { error: { message } };
    }
  };

  const signOut = async () => {
    clearToken();
    setSession(null);
    setUser(null);
  };

  return { user, session, loading, signIn, signUp, signOut };
}
