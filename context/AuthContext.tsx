import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'OPERATOR' | 'SUPERVISOR';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
}

// Seeded user accounts for demo
export const SEEDED_USERS: User[] = [
  {
    id: 'op1',
    username: 'operator',
    password: 'op123',
    role: 'OPERATOR',
    name: 'John Operator',
  },
  {
    id: 'op2',
    username: 'operator2',
    password: 'op456',
    role: 'OPERATOR',
    name: 'Jane Operator',
  },
  {
    id: 'sup1',
    username: 'supervisor',
    password: 'sup123',
    role: 'SUPERVISOR',
    name: 'Mike Supervisor',
  },
];

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('userId');
        if (savedUserId) {
          const savedUser = SEEDED_USERS.find(u => u.id === savedUserId);
          if (savedUser) {
            setUser(savedUser);
            setRole(savedUser.role);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const foundUser = SEEDED_USERS.find(
        u => u.username === username && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid username or password' };
      }

      await AsyncStorage.setItem('userId', foundUser.id);
      setUser(foundUser);
      setRole(foundUser.role);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
