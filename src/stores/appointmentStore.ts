import { create } from 'zustand';
import { Appointment, AppointmentForm, AppointmentFilters, TimeSlot } from '@/types';
import { apiService, endpoints } from '@/services/api';
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
      const currentFilters = filters || get().filters;
      const response = await apiService.get<Appointment[]>(
        endpoints.appointments.list,
        currentFilters
      );

      if (response.success) {
        const appointments = response.data;
        const now = new Date();
        
        const upcoming = appointments.filter(apt => 
          new Date(apt.date + 'T' + apt.startTime) > now
        );
        const past = appointments.filter(apt => 
          new Date(apt.date + 'T' + apt.startTime) <= now
        );

        set({
          appointments,
          upcomingAppointments: upcoming,
          pastAppointments: past,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.message || 'Erro ao carregar consultas',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao carregar consultas');
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

  fetchUpcomingAppointments: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get<Appointment[]>(
        endpoints.appointments.list,
        { status: ['scheduled', 'confirmed'], upcoming: true }
      );

      if (response.success) {
        set({
          upcomingAppointments: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.message || 'Erro ao carregar próximas consultas',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao carregar próximas consultas');
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

  fetchPastAppointments: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.get<Appointment[]>(
        endpoints.appointments.list,
        { status: ['completed'], past: true }
      );

      if (response.success) {
        set({
          pastAppointments: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.message || 'Erro ao carregar consultas passadas',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao carregar consultas passadas');
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
      const response = await apiService.get<Appointment>(
        endpoints.appointments.get(id)
      );

      if (response.success) {
        set({
          selectedAppointment: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        set({
          error: response.message || 'Erro ao carregar consulta',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao carregar consulta');
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro de conexão';
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
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Criar appointment simulado
      const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        patientId: 'patient_1',
        professionalId: appointmentData.professionalId,
        specialty: appointmentData.specialty,
        hospitalId: appointmentData.hospitalId,
        date: appointmentData.date,
        startTime: appointmentData.time,
        endTime: appointmentData.time.split(':').map((v, i) => i === 0 ? String(parseInt(v) + 1) : v).join(':'),
        status: 'scheduled',
        type: appointmentData.type,
        notes: appointmentData.notes,
        symptoms: appointmentData.symptoms,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: [newAppointment, ...state.appointments],
        upcomingAppointments: [newAppointment, ...state.upcomingAppointments],
        isLoading: false,
        error: null,
      }));

      toast.success('Consulta agendada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = 'Erro ao agendar consulta. Tente novamente.';
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
      const response = await apiService.put<Appointment>(
        endpoints.appointments.update(id),
        appointmentData
      );

      if (response.success) {
        const updatedAppointment = response.data;
        
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
      } else {
        set({
          error: response.message || 'Erro ao atualizar consulta',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao atualizar consulta');
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

  cancelAppointment: async (id: string, reason?: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.post<Appointment>(
        endpoints.appointments.cancel(id),
        { reason }
      );

      if (response.success) {
        const cancelledAppointment = response.data;
        
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
      } else {
        set({
          error: response.message || 'Erro ao cancelar consulta',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao cancelar consulta');
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

  rescheduleAppointment: async (id: string, newDate: string, newTime: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.post<Appointment>(
        endpoints.appointments.reschedule(id),
        { newDate, newTime }
      );

      if (response.success) {
        const rescheduledAppointment = response.data;
        
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
      } else {
        set({
          error: response.message || 'Erro ao reagendar consulta',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao reagendar consulta');
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

  completeAppointment: async (id: string, notes?: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.post<Appointment>(
        endpoints.appointments.complete(id),
        { notes }
      );

      if (response.success) {
        const completedAppointment = response.data;
        
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
      } else {
        set({
          error: response.message || 'Erro ao finalizar consulta',
          isLoading: false,
        });
        toast.error(response.message || 'Erro ao finalizar consulta');
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
