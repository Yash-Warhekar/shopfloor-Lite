import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'OPERATOR' | 'SUPERVISOR';

export interface User {
  id: string;
  username: string;
  role: Role | null;
  name: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('userId');
        const savedJWT = await AsyncStorage.getItem('mockJWT');
        const savedRole = await AsyncStorage.getItem('userRole');
        if (savedUserId && savedJWT) {
          const loaded: User = {
            id: savedUserId,
            username: savedUserId,
            role: (savedRole as Role) || null,
            name: savedUserId.split('@')[0],
          };
          setUser(loaded);
          setRole(loaded.role);
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
      
      const id = username;
      const name = username.includes('@') ? username.split('@')[0] : username;

      const newUser: User = {
        id,
        username: id,
        role: null,
        name,
      };

      const mockJWT = `mock-jwt-${Date.now()}`;

      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('mockJWT', mockJWT);

      const savedRole = await AsyncStorage.getItem('userRole');
      if (savedRole) {
        newUser.role = savedRole as Role;
        await AsyncStorage.setItem('userRole', savedRole);
        setRole(savedRole as Role);
      }

      setUser(newUser);

      const isNewUser = !newUser.role;

      return { success: true, isNewUser };
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
      await AsyncStorage.removeItem('mockJWT');
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
