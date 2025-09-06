// Tipos principais do sistema MedConnect

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  role: 'patient' | 'professional' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Professional extends User {
  role: 'professional';
  crm: string;
  specialties: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  bio: string;
  consultationPrice: number;
  availableSlots: TimeSlot[];
  hospitalAffiliations: string[];
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory: MedicalRecord[];
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface TimeSlot {
  id: string;
  professionalId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  specialty: string;
  hospitalId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: Prescription[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  professionalId: string;
  appointmentId: string;
  type: 'consultation' | 'exam' | 'prescription' | 'note';
  title: string;
  description: string;
  date: string;
  files?: MedicalFile[];
  isPrivate: boolean;
}

export interface MedicalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedAt: string;
}

export interface Review {
  id: string;
  patientId: string;
  professionalId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  specialties: string[];
  rating: number;
  totalReviews: number;
  facilities: string[];
  isActive: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  isRead: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  appointmentId: string;
  type: 'email' | 'sms' | 'push';
  scheduledFor: string;
  message: string;
  isSent: boolean;
  sentAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'system' | 'promotion';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Tipos para formulários
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: 'M' | 'F' | 'O';
  role: 'patient' | 'professional';
  crm?: string;
  specialties?: string[];
  experience?: number;
  bio?: string;
  consultationPrice?: number;
  acceptTerms: boolean;
}

export interface AppointmentForm {
  professionalId: string;
  specialty: string;
  hospitalId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
  notes?: string;
  symptoms?: string;
}

// Tipos para API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros e busca
export interface AppointmentFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string[];
  specialty?: string;
  professionalId?: string;
  hospitalId?: string;
}

export interface ProfessionalFilters {
  specialties?: string[];
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: string;
  hospitalId?: string;
}

// Tipos para dashboard
export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  averageRating: number;
  newPatients: number;
  returningPatients: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}
