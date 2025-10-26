import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  attachToken,
  clearToken,
  loginRequest,
  registerRequest,
  fetchCurrentUser
} from '../api/client.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fittrack_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        clearToken();
        setLoading(false);
        return;
      }
      attachToken(token);
      try {
        const profile = await fetchCurrentUser();
        setUser(profile);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { token: authToken, user: authUser } = await loginRequest(credentials);
      localStorage.setItem('fittrack_token', authToken);
      attachToken(authToken);
      setToken(authToken);
      setUser(authUser);
      setError(null);
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { token: authToken, user: authUser } = await registerRequest(payload);
      localStorage.setItem('fittrack_token', authToken);
      attachToken(authToken);
      setToken(authToken);
      setUser(authUser);
      setError(null);
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('fittrack_token');
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, register, logout }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
