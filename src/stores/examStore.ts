import { create } from 'zustand';
import { ExamResult } from '@/types';
import { examService } from '@/services/firebaseService';
import toast from 'react-hot-toast';

interface ExamState {
  examResults: ExamResult[];
  isLoading: boolean;
  error: string | null;
  filters: {
    patientId?: string;
    professionalId?: string;
    status?: string;
  };
}

interface ExamActions {
  fetchExamResults: (filters?: ExamState['filters']) => Promise<void>;
  createExamResult: (exam: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  shareExamResult: (id: string, isShared: boolean) => Promise<boolean>;
  setFilters: (filters: ExamState['filters']) => void;
  clearError: () => void;
}

type ExamStore = ExamState & ExamActions;

export const useExamStore = create<ExamStore>((set, get) => ({
  examResults: [],
  isLoading: false,
  error: null,
  filters: {},

  fetchExamResults: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentFilters = filters || get().filters;
      
      // Se não especificado, usar o ID do usuário baseado no role
      if (!currentFilters.patientId && !currentFilters.professionalId) {
        if (user.role === 'patient') {
          currentFilters.patientId = user.id;
        } else if (user.role === 'professional') {
          currentFilters.professionalId = user.id;
        }
      }

      const examResults = await examService.getExamResults(currentFilters);

      set({
        examResults,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar resultados de exames';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  createExamResult: async (examData) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const examResult = await examService.createExamResult({
        ...examData,
        professionalId: user.role === 'professional' ? user.id : examData.professionalId,
      });

      set(state => ({
        examResults: [examResult, ...state.examResults],
        isLoading: false,
        error: null,
      }));

      toast.success('Resultado de exame cadastrado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao cadastrar resultado de exame';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  shareExamResult: async (id, isShared) => {
    set({ isLoading: true, error: null });

    try {
      await examService.shareExamResult(id, isShared);

      set(state => ({
        examResults: state.examResults.map(exam =>
          exam.id === id ? { ...exam, isShared } : exam
        ),
        isLoading: false,
        error: null,
      }));

      toast.success(
        isShared
          ? 'Resultado de exame compartilhado com sucesso!'
          : 'Compartilhamento removido com sucesso!'
      );
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar compartilhamento';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));

