import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Role = 'OPERATOR' | 'SUPERVISOR';

const RoleContext = createContext<{
  role: Role | null;
  setRole: (role: Role) => void;
  logout: () => void;
}>({
  role: null,
  setRole: () => {},
  logout: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted role on mount
  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem('userRole');
        if (savedRole) {
          setRole(savedRole as Role);
        }
      } catch (error) {
        console.error('Failed to load role from AsyncStorage:', error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadRole();
  }, []);

  // Save role to AsyncStorage whenever it changes
  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    AsyncStorage.setItem('userRole', newRole).catch(e =>
      console.error('Failed to save role:', e)
    );
  };

  const handleLogout = () => {
    setRole(null);
    AsyncStorage.removeItem('userRole').catch(e =>
      console.error('Failed to clear role:', e)
    );
  };

  if (!isHydrated) {
    return null; // Don't render until role is loaded
  }

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, logout: handleLogout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
