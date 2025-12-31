"use client";
import { createContext, useContext, useState } from 'react';

type Role = 'OPERATOR' | 'SUPERVISOR';

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
}>({
  role: 'OPERATOR',
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('OPERATOR');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
