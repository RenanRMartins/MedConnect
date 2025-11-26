import { useAuthStore } from '@/stores/authStore';

export type UserRole = 'patient' | 'doctor' | 'admin';

export const useUserRole = () => {
  const { user } = useAuthStore();
  
  const userRole: UserRole = user?.role === 'professional' ? 'doctor' : (user?.role === 'admin' ? 'admin' : 'patient');
  const isLoading = !user;

  return {
    userRole,
    isLoading,
    isPatient: userRole === 'patient',
    isDoctor: userRole === 'doctor',
    isAdmin: userRole === 'admin',
  };
};
