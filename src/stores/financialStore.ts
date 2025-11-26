import { create } from 'zustand';
import { FinancialTransaction, ProfitabilityDashboard } from '@/types';
import { financialService } from '@/services/firebaseService';
import toast from 'react-hot-toast';

interface FinancialState {
  transactions: FinancialTransaction[];
  dashboard: ProfitabilityDashboard | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: 'revenue' | 'expense';
    dateFrom?: string;
    dateTo?: string;
    category?: string;
  };
}

interface FinancialActions {
  fetchTransactions: (filters?: FinancialState['filters']) => Promise<void>;
  createTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  fetchDashboard: (startDate?: string, endDate?: string) => Promise<void>;
  setFilters: (filters: FinancialState['filters']) => void;
  clearError: () => void;
}

type FinancialStore = FinancialState & FinancialActions;

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  transactions: [],
  dashboard: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchTransactions: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentFilters = filters || get().filters;
      const transactions = await financialService.getTransactions({
        userId: user.id,
        ...currentFilters,
      });

      set({
        transactions,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar transações';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  createTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const transaction = await financialService.createTransaction({
        ...transactionData,
        userId: user.id,
      });

      set(state => ({
        transactions: [transaction, ...state.transactions],
        isLoading: false,
        error: null,
      }));

      toast.success(
        transactionData.type === 'revenue'
          ? 'Receita registrada com sucesso!'
          : 'Despesa registrada com sucesso!'
      );
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar transação';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchDashboard: async (startDate, endDate) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const dashboard = await financialService.getProfitabilityDashboard(
        user.id,
        startDate,
        endDate
      );

      set({
        dashboard,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar dashboard';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));

