import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/mockApi.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'project-access-session';

function readSavedSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    return rawSession ? JSON.parse(rawSession) : { user: null, token: null };
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSavedSession);

  async function login(username, password) {
    const nextSession = await api.login(username, password);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession.user;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setSession({ user: null, token: null });
  }

  const value = useMemo(
    () => ({ ...session, login, logout }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
