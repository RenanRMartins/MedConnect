import { create } from 'zustand';
import { Supply, SupplyMovement, LowStockAlert, ConsumptionReport } from '@/types';
import { supplyService } from '@/services/firebaseService';
import toast from 'react-hot-toast';

interface SupplyState {
  supplies: Supply[];
  movements: SupplyMovement[];
  lowStockAlerts: LowStockAlert[];
  consumptionReports: ConsumptionReport[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    lowStockOnly?: boolean;
  };
}

interface SupplyActions {
  fetchSupplies: (filters?: SupplyState['filters']) => Promise<void>;
  createSupply: (supply: Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateSupply: (id: string, updates: Partial<Supply>) => Promise<boolean>;
  updateStock: (id: string, quantity: number, reason: string) => Promise<boolean>;
  fetchLowStockAlerts: () => Promise<void>;
  fetchConsumptionReports: (supplyId?: string, days?: number) => Promise<void>;
  setFilters: (filters: SupplyState['filters']) => void;
  clearError: () => void;
}

type SupplyStore = SupplyState & SupplyActions;

export const useSupplyStore = create<SupplyStore>((set, get) => ({
  supplies: [],
  movements: [],
  lowStockAlerts: [],
  consumptionReports: [],
  isLoading: false,
  error: null,
  filters: {},

  fetchSupplies: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const currentFilters = filters || get().filters;
      const supplies = await supplyService.getSupplies(currentFilters);

      set({
        supplies,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar insumos';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  createSupply: async (supplyData) => {
    set({ isLoading: true, error: null });

    try {
      const supply = await supplyService.createSupply(supplyData);

      set(state => ({
        supplies: [...state.supplies, supply],
        isLoading: false,
        error: null,
      }));

      toast.success('Insumo cadastrado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao cadastrar insumo';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  updateSupply: async (id, updates) => {
    set({ isLoading: true, error: null });

    try {
      // Atualizar no Firestore
      const { doc, updateDoc, getDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/services/firebase');
      const supplyRef = doc(db, 'supplies', id);
      
      await updateDoc(supplyRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const updatedDoc = await getDoc(supplyRef);
      const data = updatedDoc.data();
      if (!data) throw new Error('Insumo não encontrado');
      
      const updatedSupply: Supply = {
        id: updatedDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Supply;

      set(state => ({
        supplies: state.supplies.map(s => s.id === id ? updatedSupply : s),
        isLoading: false,
        error: null,
      }));

      toast.success('Insumo atualizado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar insumo';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  updateStock: async (id, quantity, reason) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await supplyService.updateStock(id, quantity, reason, user.id);
      
      // Recarregar insumos
      await get().fetchSupplies();

      set({
        isLoading: false,
        error: null,
      });

      toast.success('Estoque atualizado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar estoque';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchLowStockAlerts: async () => {
    set({ isLoading: true, error: null });

    try {
      const alerts = await supplyService.getLowStockAlerts();

      set({
        lowStockAlerts: alerts,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar alertas';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchConsumptionReports: async (supplyId, days = 30) => {
    set({ isLoading: true, error: null });

    try {
      const reports = await supplyService.getConsumptionReports(supplyId, days);

      set({
        consumptionReports: reports,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar relatórios';
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

