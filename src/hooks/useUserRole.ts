import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export type UserRole = 'patient' | 'doctor' | 'admin';

export const useUserRole = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simular detecção de tipo de usuário baseado no email ou metadados
      // Em uma aplicação real, isso viria do backend
      const userEmail = user.primaryEmailAddress?.emailAddress || '';
      const firstName = user.firstName || '';
      
      // Lógica mais robusta para determinar o tipo de usuário
      if (
        userEmail.includes('doctor') || 
        userEmail.includes('medico') || 
        userEmail.includes('dr.') ||
        userEmail.includes('@medconnect.com') ||
        firstName.toLowerCase().includes('dr') ||
        firstName.toLowerCase().includes('doctor')
      ) {
        setUserRole('doctor');
      } else if (userEmail.includes('admin') || userEmail.includes('@admin.medconnect.com')) {
        setUserRole('admin');
      } else {
        setUserRole('patient');
      }
      
      setIsLoading(false);
    }
  }, [user]);

  return {
    userRole,
    isLoading,
    isPatient: userRole === 'patient',
    isDoctor: userRole === 'doctor',
    isAdmin: userRole === 'admin',
  };
};
