import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginForm, RegisterForm } from '@/types';
import { apiService, endpoints } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Ações
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post<{ user: User; token: string }>(
            endpoints.auth.login,
            credentials
          );

          if (response.success) {
            const { user, token } = response.data;
            
            // Salvar token no localStorage
            localStorage.setItem('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success('Login realizado com sucesso!');
            return true;
          } else {
            set({
              error: response.message || 'Erro ao fazer login',
              isLoading: false,
            });
            toast.error(response.message || 'Erro ao fazer login');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro de conexão';
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (userData: RegisterForm) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.post<{ user: User; token: string }>(
            endpoints.auth.register,
            userData
          );

          if (response.success) {
            const { user, token } = response.data;
            
            // Salvar token no localStorage
            localStorage.setItem('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success('Cadastro realizado com sucesso!');
            return true;
          } else {
            set({
              error: response.message || 'Erro ao fazer cadastro',
              isLoading: false,
            });
            toast.error(response.message || 'Erro ao fazer cadastro');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro de conexão';
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: () => {
        // Limpar token do localStorage
        localStorage.removeItem('auth_token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        toast.success('Logout realizado com sucesso!');
      },

      refreshUser: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await apiService.get<{ user: User }>(endpoints.users.profile);
          
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          } else {
            // Token inválido
            localStorage.removeItem('auth_token');
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          // Token inválido ou erro de conexão
          localStorage.removeItem('auth_token');
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiService.put<{ user: User }>(
            endpoints.users.updateProfile,
            userData
          );

          if (response.success) {
            set({
              user: response.data.user,
              isLoading: false,
              error: null,
            });
            toast.success('Perfil atualizado com sucesso!');
            return true;
          } else {
            set({
              error: response.message || 'Erro ao atualizar perfil',
              isLoading: false,
            });
            toast.error(response.message || 'Erro ao atualizar perfil');
            return false;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro de conexão';
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
