import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { watchAuth, googleSignIn, googleSignOut } from '../lib/firebase';
import type { User } from 'firebase/auth';

type AuthCtx = {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => watchAuth(setUser), []);

  return (
    <Ctx.Provider
      value={{
        user,
        signIn: async () => { await googleSignIn(); },
        signOut: async () => { await googleSignOut(); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
