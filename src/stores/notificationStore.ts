import { create } from 'zustand';
import { Notification, Reminder } from '@/types';
import { notificationService, reminderService } from '@/services/firebaseService';
import toast from 'react-hot-toast';

interface NotificationState {
  notifications: Notification[];
  reminders: Reminder[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  fetchReminders: () => Promise<void>;
  createReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  clearError: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  reminders: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (unreadOnly = false) => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const notifications = await notificationService.getUserNotifications(user.id, unreadOnly);
      const unreadCount = notifications.filter(n => !n.isRead).length;

      set({
        notifications,
        unreadCount,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar notificações';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      toast.error(error.message || 'Erro ao marcar notificação como lida');
    }
  },

  markAllAsRead: async () => {
    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      await notificationService.markAllAsRead(user.id);
      
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
      
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao marcar notificações como lidas');
    }
  },

  createNotification: async (notification) => {
    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const newNotification = await notificationService.createNotification({
        ...notification,
        userId: user.id,
      });

      set(state => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar notificação');
    }
  },

  fetchReminders: async () => {
    set({ isLoading: true, error: null });

    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const reminders = await reminderService.getUserReminders(user.id);

      set({
        reminders,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar lembretes';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  createReminder: async (reminder) => {
    try {
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const newReminder = await reminderService.createReminder({
        ...reminder,
        userId: user.id,
      });

      set(state => ({
        reminders: [...state.reminders, newReminder],
      }));

      toast.success('Lembrete criado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar lembrete');
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

