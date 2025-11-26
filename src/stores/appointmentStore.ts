import { create } from 'zustand';
import { Appointment, AppointmentForm, AppointmentFilters, TimeSlot } from '@/types';
import toast from 'react-hot-toast';

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  availableSlots: TimeSlot[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  filters: AppointmentFilters;
}

interface AppointmentActions {
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  fetchUpcomingAppointments: () => Promise<void>;
  fetchPastAppointments: () => Promise<void>;
  fetchAvailableSlots: (professionalId: string, date: string) => Promise<void>;
  getAppointment: (id: string) => Promise<Appointment | null>;
  createAppointment: (appointmentData: AppointmentForm) => Promise<boolean>;
  updateAppointment: (id: string, appointmentData: Partial<AppointmentForm>) => Promise<boolean>;
  cancelAppointment: (id: string, reason?: string) => Promise<boolean>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<boolean>;
  completeAppointment: (id: string, notes?: string) => Promise<boolean>;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setFilters: (filters: AppointmentFilters) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AppointmentStore = AppointmentState & AppointmentActions;

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  // Estado inicial
  appointments: [],
  upcomingAppointments: [],
  pastAppointments: [],
  availableSlots: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
  filters: {},

  // Ações
  fetchAppointments: async (filters?: AppointmentFilters) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const currentFilters = filters || get().filters;
      const role = user.role;
      
      // Garantir que temos o ID correto do usuário
      const { firebaseUser } = useAuthStore.getState();
      const userId = user.id || firebaseUser?.uid;
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      
      // Construir filtros para Firestore
      const firestoreFilters: any = {
        dateFrom: currentFilters.dateFrom,
        dateTo: currentFilters.dateTo,
        status: currentFilters.status,
      };
      
      if (role === 'patient') {
        firestoreFilters.patientId = userId;
      } else if (role === 'professional') {
        firestoreFilters.professionalId = userId;
      }
      
      if (currentFilters.professionalId) {
        firestoreFilters.professionalId = currentFilters.professionalId;
      }
      
      if (currentFilters.hospitalId) {
        // Firestore não suporta múltiplos where com AND facilmente
        // Vamos filtrar depois
      }

      const appointments = await appointmentService.getAppointments(firestoreFilters);
      
      // Filtrar por hospital se necessário
      let filteredAppointments = appointments;
      if (currentFilters.hospitalId) {
        filteredAppointments = appointments.filter(apt => apt.hospitalId === currentFilters.hospitalId);
      }
      
      const now = new Date();
      
      const upcoming = filteredAppointments.filter(apt => 
        new Date(apt.date + 'T' + apt.startTime) > now
      );
      const past = filteredAppointments.filter(apt => 
        new Date(apt.date + 'T' + apt.startTime) <= now
      );

      set({
        appointments: filteredAppointments,
        upcomingAppointments: upcoming,
        pastAppointments: past,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar consultas';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchUpcomingAppointments: async () => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const appointments = await appointmentService.getUpcomingAppointments(
        user.id,
        user.role as 'patient' | 'professional'
      );

      set({
        upcomingAppointments: appointments,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar próximas consultas';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchPastAppointments: async () => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const { useAuthStore } = await import('./authStore');
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const appointments = await appointmentService.getPastAppointments(
        user.id,
        user.role as 'patient' | 'professional'
      );

      set({
        pastAppointments: appointments,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar consultas passadas';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchAvailableSlots: async (professionalId: string, date: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get<TimeSlot[]>(
        endpoints.professionals.availability(professionalId),
        { date }
      );

      if (response.success) {
        set({
          availableSlots: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.message || 'Erro ao carregar horários disponíveis',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao carregar horários disponíveis');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro de conexão';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  getAppointment: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const appointment = await appointmentService.getAppointment(id);

      if (appointment) {
        set({
          selectedAppointment: appointment,
          isLoading: false,
          error: null,
        });
        return appointment;
      } else {
        set({
          error: 'Consulta não encontrada',
          isLoading: false,
        });
        toast.error('Consulta não encontrada');
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar consulta';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return null;
    }
  },

  createAppointment: async (appointmentData: AppointmentForm) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const { useAuthStore } = await import('./authStore');
      const { user, firebaseUser } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Garantir que temos o ID correto do usuário
      const patientId = user.id || firebaseUser?.uid;
      if (!patientId) {
        throw new Error('ID do usuário não encontrado');
      }

      // Calcular horário de término (1 hora após início)
      const [hours, minutes] = appointmentData.time.split(':').map(Number);
      const endTime = `${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      const newAppointment = await appointmentService.createAppointment({
        patientId: patientId,
        professionalId: appointmentData.professionalId,
        specialty: appointmentData.specialty,
        hospitalId: appointmentData.hospitalId,
        date: appointmentData.date,
        startTime: appointmentData.time,
        endTime: endTime,
        status: 'scheduled',
        type: appointmentData.type,
        notes: appointmentData.notes,
        symptoms: appointmentData.symptoms,
      });
      
      // Adicionar ao estado local imediatamente
      set(state => ({
        appointments: [newAppointment, ...state.appointments],
        upcomingAppointments: [newAppointment, ...state.upcomingAppointments],
        isLoading: false,
        error: null,
      }));

      // Recarregar do Firestore para garantir sincronização
      setTimeout(async () => {
        try {
          await get().fetchAppointments();
          await get().fetchUpcomingAppointments();
          await get().fetchPastAppointments();
        } catch (refreshError) {
          // Silenciosamente ignorar erro de refresh
        }
      }, 1500);

      toast.success('Consulta agendada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao agendar consulta. Tente novamente.';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  updateAppointment: async (id: string, appointmentData: Partial<AppointmentForm>) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      
      // Converter AppointmentForm para formato de Appointment
      const updates: any = {};
      if (appointmentData.date) updates.date = appointmentData.date;
      if (appointmentData.time) {
        updates.startTime = appointmentData.time;
        // Calcular endTime
        const [hours, minutes] = appointmentData.time.split(':').map(Number);
        updates.endTime = `${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      if (appointmentData.notes !== undefined) updates.notes = appointmentData.notes;
      if (appointmentData.symptoms !== undefined) updates.symptoms = appointmentData.symptoms;
      if (appointmentData.type) updates.type = appointmentData.type;
      if (appointmentData.specialty) updates.specialty = appointmentData.specialty;
      if (appointmentData.hospitalId) updates.hospitalId = appointmentData.hospitalId;

      const updatedAppointment = await appointmentService.updateAppointment(id, updates);
      
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? updatedAppointment : apt
        ),
        upcomingAppointments: state.upcomingAppointments.map(apt => 
          apt.id === id ? updatedAppointment : apt
        ),
        pastAppointments: state.pastAppointments.map(apt => 
          apt.id === id ? updatedAppointment : apt
        ),
        selectedAppointment: state.selectedAppointment?.id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
        error: null,
      }));

      toast.success('Consulta atualizada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar consulta';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  cancelAppointment: async (id: string, reason?: string) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const currentAppointment = await appointmentService.getAppointment(id);
      
      if (!currentAppointment) {
        throw new Error('Consulta não encontrada');
      }
      
      const cancelledAppointment = await appointmentService.updateAppointment(id, {
        status: 'cancelled',
        notes: reason ? `${reason}\n\n${currentAppointment.notes || ''}` : currentAppointment.notes,
      });
      
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? cancelledAppointment : apt
        ),
        upcomingAppointments: state.upcomingAppointments.filter(apt => apt.id !== id),
        selectedAppointment: state.selectedAppointment?.id === id ? cancelledAppointment : state.selectedAppointment,
        isLoading: false,
        error: null,
      }));

      toast.success('Consulta cancelada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao cancelar consulta';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  rescheduleAppointment: async (id: string, newDate: string, newTime: string) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      
      // Calcular endTime
      const [hours, minutes] = newTime.split(':').map(Number);
      const endTime = `${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const rescheduledAppointment = await appointmentService.updateAppointment(id, {
        date: newDate,
        startTime: newTime,
        endTime: endTime,
      });
      
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? rescheduledAppointment : apt
        ),
        upcomingAppointments: state.upcomingAppointments.map(apt => 
          apt.id === id ? rescheduledAppointment : apt
        ),
        selectedAppointment: state.selectedAppointment?.id === id ? rescheduledAppointment : state.selectedAppointment,
        isLoading: false,
        error: null,
      }));

      toast.success('Consulta reagendada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao reagendar consulta';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  completeAppointment: async (id: string, notes?: string) => {
    set({ isLoading: true, error: null });

    try {
      const { appointmentService } = await import('@/services/firebaseService');
      const currentAppointment = await appointmentService.getAppointment(id);
      
      if (!currentAppointment) {
        throw new Error('Consulta não encontrada');
      }
      
      const completedAppointment = await appointmentService.updateAppointment(id, {
        status: 'completed',
        notes: notes ? `${notes}\n\n${currentAppointment.notes || ''}` : currentAppointment.notes,
      });
      
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? completedAppointment : apt
        ),
        upcomingAppointments: state.upcomingAppointments.filter(apt => apt.id !== id),
        pastAppointments: [completedAppointment, ...state.pastAppointments],
        selectedAppointment: state.selectedAppointment?.id === id ? completedAppointment : state.selectedAppointment,
        isLoading: false,
        error: null,
      }));

      toast.success('Consulta finalizada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao finalizar consulta';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      return false;
    }
  },

  setSelectedAppointment: (appointment: Appointment | null) => {
    set({ selectedAppointment: appointment });
  },

  setFilters: (filters: AppointmentFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
