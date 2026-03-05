'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = {
  usuario: {
    email: 'maria@yahoo.com.br',
    password: '1234',
  },
  empresa: {
    email: 'empresa@reciclagem.com',
    password: '1234',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string,
    userType: 'usuario' | 'empresa' = 'usuario'
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[userType];
    if (email === mockUser.email && password === mockUser.password) {
      setUser({ email, type: userType });
      return true;
    }
    if (email === MOCK_USERS.usuario.email && password === MOCK_USERS.usuario.password) {
      setUser({ email, type: 'usuario' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

