import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/hooks/useUserRole';

interface UserRoleContextType {
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isPatient: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRoleContext = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRoleContext must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: React.ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const value = {
    selectedRole,
    setSelectedRole,
    isPatient: selectedRole === 'patient',
    isDoctor: selectedRole === 'doctor',
    isAdmin: selectedRole === 'admin',
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};
