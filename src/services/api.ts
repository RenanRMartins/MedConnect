import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.medconnect.com';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratar erros globais
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data);
    return response.data;
  }

  // Métodos específicos para paginação
  async getPaginated<T>(
    url: string,
    page: number = 1,
    limit: number = 10,
    params?: any
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<PaginatedResponse<T>>(url, {
      page,
      limit,
      ...params,
    });
    return response.data;
  }

  // Upload de arquivos
  async uploadFile(file: File, folder: string = 'general'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Download de arquivos
  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Instância singleton
export const apiService = new ApiService();

// Endpoints específicos
export const endpoints = {
  // Autenticação
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },

  // Usuários
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
    uploadAvatar: '/users/avatar',
  },

  // Profissionais
  professionals: {
    list: '/professionals',
    get: (id: string) => `/professionals/${id}`,
    specialties: '/professionals/specialties',
    availability: (id: string) => `/professionals/${id}/availability`,
    reviews: (id: string) => `/professionals/${id}/reviews`,
  },

  // Consultas
  appointments: {
    list: '/appointments',
    get: (id: string) => `/appointments/${id}`,
    create: '/appointments',
    update: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
    complete: (id: string) => `/appointments/${id}/complete`,
  },

  // Histórico médico
  medicalRecords: {
    list: '/medical-records',
    get: (id: string) => `/medical-records/${id}`,
    create: '/medical-records',
    update: (id: string) => `/medical-records/${id}`,
    delete: (id: string) => `/medical-records/${id}`,
  },

  // Hospitais
  hospitals: {
    list: '/hospitals',
    get: (id: string) => `/hospitals/${id}`,
    specialties: (id: string) => `/hospitals/${id}/specialties`,
  },

  // Especialidades
  specialties: {
    list: '/specialties',
    get: (id: string) => `/specialties/${id}`,
  },

  // Avaliações
  reviews: {
    list: '/reviews',
    get: (id: string) => `/reviews/${id}`,
    create: '/reviews',
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
  },

  // Chat/Support
  support: {
    tickets: '/support/tickets',
    getTicket: (id: string) => `/support/tickets/${id}`,
    createTicket: '/support/tickets',
    updateTicket: (id: string) => `/support/tickets/${id}`,
    messages: (ticketId: string) => `/support/tickets/${ticketId}/messages`,
    sendMessage: (ticketId: string) => `/support/tickets/${ticketId}/messages`,
  },

  // Notificações
  notifications: {
    list: '/notifications',
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
  },

  // Lembretes
  reminders: {
    list: '/reminders',
    create: '/reminders',
    update: (id: string) => `/reminders/${id}`,
    delete: (id: string) => `/reminders/${id}`,
  },

  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    charts: '/dashboard/charts',
    recentActivity: '/dashboard/recent-activity',
  },
};

export default apiService;
