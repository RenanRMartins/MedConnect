import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { userService } from '@/services/firebaseService';
import { User, LoginForm, RegisterForm } from '@/types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true, // Começar como true para verificar auth state
      error: null,

      // Inicializar autenticação
      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Usuário autenticado
            try {
              // Buscar dados do usuário no Firestore
              let user = await userService.getUser(firebaseUser.uid);
              
              // Se não existir no Firestore, criar com dados básicos
              if (!user) {
                user = await userService.createOrUpdateUser(firebaseUser.uid, {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  name: firebaseUser.displayName || '',
                  phone: '',
                  cpf: '',
                  birthDate: '',
                  gender: 'O',
                  role: 'patient',
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }
              
              set({
                firebaseUser,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (error: any) {
              set({
                error: 'Erro ao carregar dados do usuário',
                isLoading: false,
              });
            }
          } else {
            // Usuário não autenticado
            set({
              firebaseUser: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        });
      },

      // Ações
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const firebaseUser = userCredential.user;
          
          // Buscar dados do usuário no Firestore
          let user = await userService.getUser(firebaseUser.uid);
          
          if (!user) {
            // Criar usuário básico se não existir
            user = await userService.createOrUpdateUser(firebaseUser.uid, {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              phone: '',
              cpf: '',
              birthDate: '',
              gender: 'O',
              role: 'patient',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }

          set({
            firebaseUser,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success('Login realizado com sucesso!');
          return true;
        } catch (error: any) {
          let errorMessage = 'Erro ao fazer login';
          
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'Usuário não encontrado';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Senha incorreta';
              break;
            case 'auth/invalid-email':
              errorMessage = 'E-mail inválido';
              break;
            case 'auth/user-disabled':
              errorMessage = 'Usuário desabilitado';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
              break;
            default:
              errorMessage = error.message || 'Erro ao fazer login';
          }
          
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
          // Criar usuário no Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );

          const firebaseUser = userCredential.user;

          // Atualizar perfil do Firebase
          await updateFirebaseProfile(firebaseUser, {
            displayName: userData.name,
          });

          // Criar documento do usuário no Firestore
          const user: User = {
            id: firebaseUser.uid,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            cpf: userData.cpf,
            birthDate: userData.birthDate,
            gender: userData.gender,
            role: userData.role,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Adicionar campos específicos do tipo de usuário
          if (userData.role === 'professional') {
            (user as any).crm = userData.crm || '';
            (user as any).specialties = userData.specialties || [];
            (user as any).experience = userData.experience || 0;
            (user as any).bio = userData.bio || '';
            (user as any).consultationPrice = userData.consultationPrice || 0;
            (user as any).rating = 0;
            (user as any).totalReviews = 0;
          } else {
            (user as any).allergies = [];
            (user as any).emergencyContact = userData.emergencyContact || {
              name: '',
              phone: '',
              relationship: '',
            };
          }

          // Salvar no Firestore
          await userService.createOrUpdateUser(firebaseUser.uid, user);

          set({
            firebaseUser,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success('Cadastro realizado com sucesso!');
          return true;
        } catch (error: any) {
          let errorMessage = 'Erro ao fazer cadastro';
          
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'E-mail já está em uso';
              break;
            case 'auth/invalid-email':
              errorMessage = 'E-mail inválido';
              break;
            case 'auth/weak-password':
              errorMessage = 'Senha muito fraca';
              break;
            default:
              errorMessage = error.message || 'Erro ao fazer cadastro';
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: async () => {
        try {
          // Fazer logout do Firebase primeiro
          await signOut(auth);
          
          // Limpar estado local completamente
          set({
            user: null,
            firebaseUser: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });

          // Limpar localStorage do zustand
          localStorage.removeItem('auth-storage');
          
          // Limpar qualquer outro dado de autenticação
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          
          // Aguardar um pouco para garantir que o estado foi limpo
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Redirecionar para home usando window.location para forçar reload completo
          window.location.href = '/';
          
          // Não mostrar toast aqui pois a página será recarregada
        } catch (error: any) {
          // Mesmo com erro, tentar limpar o estado
          set({
            user: null,
            firebaseUser: null,
            isAuthenticated: false,
            error: null,
          });
          localStorage.removeItem('auth-storage');
          window.location.href = '/';
        }
      },

      refreshUser: async () => {
        const { firebaseUser } = get();
        
        if (!firebaseUser) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const user = await userService.getUser(firebaseUser.uid);
          
          if (user) {
            set({
              user,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        const { firebaseUser } = get();
        
        if (!firebaseUser) {
          toast.error('Usuário não autenticado');
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          // Atualizar no Firestore
          const updatedUser = await userService.updateProfile(firebaseUser.uid, userData);
          
          // Atualizar perfil do Firebase Auth se necessário
          if (userData.name) {
            await updateFirebaseProfile(firebaseUser, {
              displayName: userData.name,
            });
          }

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
          
          toast.success('Perfil atualizado com sucesso!');
          return true;
        } catch (error: any) {
          const errorMessage = error.message || 'Erro ao atualizar perfil';
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
      // Não persistir nada - sempre verificar auth state do Firebase em tempo real
      partialize: () => ({}),
      // Ao reidratar, sempre limpar e verificar Firebase
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sempre limpar estado persistido
          state.user = null;
          state.firebaseUser = null;
          state.isAuthenticated = false;
          // O initializeAuth vai verificar o Firebase e atualizar o estado
        }
      },
    }
  )
);
