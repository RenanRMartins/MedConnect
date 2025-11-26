import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Appointment,
  MedicalRecord,
  Review,
  Notification,
  Reminder,
  FinancialTransaction,
  FinancialReport,
  ProfitabilityDashboard,
  Supply,
  SupplyMovement,
  LowStockAlert,
  ConsumptionReport,
  ExamResult,
  AutoConfirmationSettings,
} from '@/types';

// Helper para converter Timestamp do Firestore para string ISO
const timestampToISO = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp || new Date().toISOString();
};

// Helper para executar queries com fallback automático se der erro de índice
const safeQuery = async <T>(
  ref: any,
  constraints: QueryConstraint[],
  sortFn?: (a: T, b: T) => number,
  limitValue?: number
): Promise<T[]> => {
  try {
    const q = query(ref, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertFromFirestore(doc) as T);
  } catch (error: any) {
    // Se der erro de índice, tentar sem orderBy e limit
    const errorMessage = String(error.message || '');
    const errorCode = String(error.code || '');
    const errorString = String(error);
    
    // Capturar TODOS os tipos possíveis de erro de índice
    const isIndexError = 
      errorCode === 'failed-precondition' || 
      errorCode === '9' || // Código numérico do erro de índice
      errorMessage.toLowerCase().includes('index') || 
      errorMessage.toLowerCase().includes('requires an index') ||
      errorMessage.toLowerCase().includes('create_composite') ||
      errorMessage.toLowerCase().includes('the query requires an index') ||
      errorString.toLowerCase().includes('index') ||
      errorString.toLowerCase().includes('create_composite') ||
      errorMessage.includes('CIZwcm9qZWN0cy9tZV') || // ID específico do erro
      errorMessage.includes('ClZwcm9qZWN0cy9tZV'); // ID específico do erro
    
    if (isIndexError) {
      // Erro de índice detectado, tentando fallback sem orderBy
      
      // Extrair apenas constraints where (primeiros constraints geralmente são where)
      // Assumir que orderBy e limit vêm depois
      const whereConstraints: QueryConstraint[] = [];
      
      // Separar constraints: manter apenas where, remover orderBy e limit
      // where sempre vem antes de orderBy e limit
      for (let i = 0; i < constraints.length; i++) {
        const constraint = constraints[i];
        const constraintStr = String(constraint);
        
        // Se não contém orderBy ou limit, provavelmente é where
        if (!constraintStr.includes('QueryOrderByConstraint') && 
            !constraintStr.includes('QueryLimitConstraint') &&
            !constraintStr.includes('orderBy') &&
            !constraintStr.includes('limit')) {
          whereConstraints.push(constraint);
        } else {
          // Se encontrou orderBy ou limit, parar (where sempre vem antes)
          break;
        }
      }
      
      // Se não encontrou nenhum, usar apenas o primeiro (assumindo que é where)
      if (whereConstraints.length === 0 && constraints.length > 0) {
        whereConstraints.push(constraints[0]);
      }
      
      if (whereConstraints.length > 0) {
        try {
          const q = query(ref, ...whereConstraints);
          const querySnapshot = await getDocs(q);
          let results = querySnapshot.docs.map(doc => convertFromFirestore(doc) as T);
          
          // Ordenar em memória se função de ordenação fornecida
          if (sortFn) {
            results.sort(sortFn);
          }
          
          // Aplicar limit se necessário
          if (limitValue && results.length > limitValue) {
            results = results.slice(0, limitValue);
          }
          
          return results;
        } catch (fallbackError: any) {
          // Se mesmo sem orderBy der erro, retornar array vazio silenciosamente
          return [];
        }
      } else {
        return [];
      }
    }
    throw error;
  }
};

// Helper para converter dados para formato do Firestore
const prepareData = (data: any) => {
  const prepared = { ...data };
  
  // Converter datas ISO para Timestamp
  if (prepared.createdAt && typeof prepared.createdAt === 'string') {
    prepared.createdAt = Timestamp.fromDate(new Date(prepared.createdAt));
  }
  if (prepared.updatedAt && typeof prepared.updatedAt === 'string') {
    prepared.updatedAt = Timestamp.fromDate(new Date(prepared.updatedAt));
  }
  if (prepared.date && typeof prepared.date === 'string') {
    // Manter date como string para facilitar queries
  }
  
  return prepared;
};

// Helper para converter dados do Firestore para formato da aplicação
const convertFromFirestore = (doc: any): any => {
  const data = doc.data();
  if (!data) return null;
  
  return {
    id: doc.id,
    ...data,
    createdAt: timestampToISO(data.createdAt),
    updatedAt: timestampToISO(data.updatedAt),
  };
};

// ============ USUÁRIOS ============
export const userService = {
  // Criar ou atualizar usuário
  async createOrUpdateUser(userId: string, userData: Partial<User>): Promise<User> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    const data = {
      ...userData,
      updatedAt: serverTimestamp(),
    };
    
    if (!userDoc.exists()) {
      data.createdAt = serverTimestamp();
      await setDoc(userRef, data);
    } else {
      await updateDoc(userRef, data);
    }
    
    const updatedDoc = await getDoc(userRef);
    return convertFromFirestore(updatedDoc) as User;
  },

  // Buscar usuário por ID
  async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return convertFromFirestore(userDoc) as User;
  },

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, 'users');
    try {
      const q = query(usersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return convertFromFirestore(querySnapshot.docs[0]) as User;
    } catch (error: any) {
      // Se der erro de índice, tentar sem limit
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        try {
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            return null;
          }
          
          return convertFromFirestore(querySnapshot.docs[0]) as User;
        } catch (fallbackError: any) {
          console.error('Erro ao buscar usuário por email:', fallbackError);
          return null;
        }
      }
      throw error;
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    const updatedDoc = await getDoc(userRef);
    return convertFromFirestore(updatedDoc) as User;
  },
};

// ============ CONSULTAS ============
export const appointmentService = {
  // Criar consulta
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const data = prepareData({
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const docRef = await addDoc(appointmentsRef, data);
      
      // Aguardar um pouco para garantir que foi salva
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Consulta não foi criada no Firestore');
      }
      
      const createdAppointment = convertFromFirestore(docSnap) as Appointment;
      return createdAppointment;
    } catch (error: any) {
      throw error;
    }
  },

  // Buscar consulta por ID
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentDoc = await getDoc(appointmentRef);
    
    if (!appointmentDoc.exists()) {
      return null;
    }
    
    return convertFromFirestore(appointmentDoc) as Appointment;
  },

  // Buscar consultas com filtros
  async getAppointments(filters: {
    patientId?: string;
    professionalId?: string;
    status?: string[];
    dateFrom?: string;
    dateTo?: string;
    limitCount?: number;
  } = {}): Promise<Appointment[]> {
    const appointmentsRef = collection(db, 'appointments');
    let appointments: Appointment[] = [];
    
    try {
      if (filters.patientId) {
        const constraints: QueryConstraint[] = [
          where('patientId', '==', filters.patientId),
          orderBy('date', 'desc')
        ];
        if (filters.limitCount) {
          constraints.push(limit(filters.limitCount));
        }
        appointments = await safeQuery<Appointment>(
          appointmentsRef,
          constraints,
          (a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.startTime.localeCompare(a.startTime);
          },
          filters.limitCount
        );
        
        // Se não encontrou nada, tentar buscar sem orderBy
        if (appointments.length === 0) {
          try {
            const simpleQuery = query(appointmentsRef, where('patientId', '==', filters.patientId));
            const simpleSnapshot = await getDocs(simpleQuery);
            appointments = simpleSnapshot.docs.map(doc => convertFromFirestore(doc) as Appointment);
            appointments.sort((a, b) => {
              const dateCompare = b.date.localeCompare(a.date);
              if (dateCompare !== 0) return dateCompare;
              return b.startTime.localeCompare(a.startTime);
            });
          } catch (simpleError) {
            // Silenciosamente retornar array vazio
          }
        }
      } else if (filters.professionalId) {
        const constraints: QueryConstraint[] = [
          where('professionalId', '==', filters.professionalId),
          orderBy('date', 'desc')
        ];
        if (filters.limitCount) {
          constraints.push(limit(filters.limitCount));
        }
        appointments = await safeQuery<Appointment>(
          appointmentsRef,
          constraints,
          (a, b) => {
            const dateCompare = b.date.localeCompare(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.startTime.localeCompare(a.startTime);
          },
          filters.limitCount
        );
      } else {
        // Buscar todas (apenas para admin ou quando não há filtros)
        try {
          const querySnapshot = await getDocs(appointmentsRef);
          appointments = querySnapshot.docs.map(doc => convertFromFirestore(doc) as Appointment);
        } catch (error: any) {
          // Se der erro de permissão, retornar array vazio
          if (error.code === 'permission-denied') {
            return [];
          }
          throw error;
        }
      }
    } catch (error: any) {
      // Se der erro geral, retornar array vazio
      return [];
    }
    
    // Filtrar em memória para evitar índices compostos
    if (filters.status && filters.status.length > 0) {
      appointments = appointments.filter(apt => filters.status!.includes(apt.status));
    }
    
    if (filters.dateFrom) {
      appointments = appointments.filter(apt => apt.date >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      appointments = appointments.filter(apt => apt.date <= filters.dateTo!);
    }
    
    // Se ainda não foi ordenado (caso de erro de índice), ordenar agora
    if (appointments.length > 0 && (!filters.patientId && !filters.professionalId)) {
      appointments.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.startTime.localeCompare(a.startTime);
      });
    }
    
    // Aplicar limite após ordenação
    if (filters.limitCount && appointments.length > filters.limitCount) {
      appointments = appointments.slice(0, filters.limitCount);
    }
    
    return appointments;
  },

  // Atualizar consulta
  async updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<Appointment> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    const data = prepareData(updates);
    data.updatedAt = serverTimestamp();
    
    await updateDoc(appointmentRef, data);
    
    const updatedDoc = await getDoc(appointmentRef);
    return convertFromFirestore(updatedDoc) as Appointment;
  },

  // Deletar consulta
  async deleteAppointment(appointmentId: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(appointmentRef);
  },

  // Buscar próximas consultas
  async getUpcomingAppointments(userId: string, role: 'patient' | 'professional'): Promise<Appointment[]> {
    const field = role === 'patient' ? 'patientId' : 'professionalId';
    const today = new Date().toISOString().split('T')[0];
    
    // Buscar todas as consultas do usuário e filtrar em memória
    const allAppointments = await this.getAppointments({
      [field]: userId,
    });
    
    const now = new Date();
    const upcoming = allAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date + 'T' + apt.startTime);
      return appointmentDate > now && 
             (apt.status === 'scheduled' || apt.status === 'confirmed') &&
             apt.date >= today;
    });
    
    return upcoming;
  },

  // Buscar consultas passadas
  async getPastAppointments(userId: string, role: 'patient' | 'professional'): Promise<Appointment[]> {
    const field = role === 'patient' ? 'patientId' : 'professionalId';
    const today = new Date().toISOString().split('T')[0];
    
    // Buscar todas as consultas do usuário e filtrar em memória
    const allAppointments = await this.getAppointments({
      [field]: userId,
    });
    
    const now = new Date();
    const past = allAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date + 'T' + apt.startTime);
      return appointmentDate <= now && 
             (apt.status === 'completed' || apt.status === 'cancelled') &&
             apt.date <= today;
    });
    
    return past;
  },
};

// ============ HISTÓRICO MÉDICO ============
export const medicalRecordService = {
  // Criar registro médico
  async createRecord(recordData: Omit<MedicalRecord, 'id' | 'date'>): Promise<MedicalRecord> {
    const recordsRef = collection(db, 'medicalRecords');
    const data = prepareData({
      ...recordData,
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(recordsRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as MedicalRecord;
  },

  // Buscar registros médicos de um paciente
  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    const recordsRef = collection(db, 'medicalRecords');
    const constraints: QueryConstraint[] = [
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    ];
    
    return safeQuery<MedicalRecord>(
      recordsRef,
      constraints,
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Buscar registro por ID
  async getRecord(recordId: string): Promise<MedicalRecord | null> {
    const recordRef = doc(db, 'medicalRecords', recordId);
    const recordDoc = await getDoc(recordRef);
    
    if (!recordDoc.exists()) {
      return null;
    }
    
    return convertFromFirestore(recordDoc) as MedicalRecord;
  },

  // Atualizar registro
  async updateRecord(recordId: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const recordRef = doc(db, 'medicalRecords', recordId);
    const data = prepareData(updates);
    data.updatedAt = serverTimestamp();
    
    await updateDoc(recordRef, data);
    
    const updatedDoc = await getDoc(recordRef);
    return convertFromFirestore(updatedDoc) as MedicalRecord;
  },

  // Deletar registro
  async deleteRecord(recordId: string): Promise<void> {
    const recordRef = doc(db, 'medicalRecords', recordId);
    await deleteDoc(recordRef);
  },
};

// ============ AVALIAÇÕES ============
export const reviewService = {
  // Criar avaliação
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const reviewsRef = collection(db, 'reviews');
    const data = prepareData({
      ...reviewData,
      createdAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(reviewsRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as Review;
  },

  // Buscar avaliações de um profissional
  async getProfessionalReviews(professionalId: string): Promise<Review[]> {
    const reviewsRef = collection(db, 'reviews');
    const constraints: QueryConstraint[] = [
      where('professionalId', '==', professionalId),
      orderBy('createdAt', 'desc')
    ];
    
    return safeQuery<Review>(
      reviewsRef,
      constraints,
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Buscar avaliação por ID
  async getReview(reviewId: string): Promise<Review | null> {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewDoc = await getDoc(reviewRef);
    
    if (!reviewDoc.exists()) {
      return null;
    }
    
    return convertFromFirestore(reviewDoc) as Review;
  },
};

// ============ NOTIFICAÇÕES ============
export const notificationService = {
  // Criar notificação
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notificationsRef = collection(db, 'notifications');
    const data = prepareData({
      ...notificationData,
      createdAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(notificationsRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as Notification;
  },

  // Buscar notificações do usuário
  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const notificationsRef = collection(db, 'notifications');
    
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    ];
    
    let notifications = await safeQuery<Notification>(
      notificationsRef,
      constraints,
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      50
    );
    
    // Filtrar isRead em memória
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }
    
    return notifications;
  },

  // Marcar como lida
  async markAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { isRead: true });
  },

  // Marcar todas como lidas
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId, true);
    const batch = notifications.map(notif => this.markAsRead(notif.id));
    await Promise.all(batch);
  },
};

// ============ LEMBRETES ============
export const reminderService = {
  // Criar lembrete
  async createReminder(reminderData: Omit<Reminder, 'id'>): Promise<Reminder> {
    const remindersRef = collection(db, 'reminders');
    const data = prepareData(reminderData);
    
    const docRef = await addDoc(remindersRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as Reminder;
  },

  // Buscar lembretes do usuário
  async getUserReminders(userId: string): Promise<Reminder[]> {
    const remindersRef = collection(db, 'reminders');
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('scheduledFor', 'asc')
    ];
    
    return safeQuery<Reminder>(
      remindersRef,
      constraints,
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
  },

  // Marcar como enviado
  async markAsSent(reminderId: string): Promise<void> {
    const reminderRef = doc(db, 'reminders', reminderId);
    await updateDoc(reminderRef, {
      isSent: true,
      sentAt: serverTimestamp(),
    });
  },
};

// ============ GESTÃO FINANCEIRA ============
export const financialService = {
  // Criar transação
  async createTransaction(transactionData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialTransaction> {
    const transactionsRef = collection(db, 'financialTransactions');
    const data = prepareData({
      ...transactionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(transactionsRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as FinancialTransaction;
  },

  // Buscar transações
  async getTransactions(filters: {
    userId: string;
    type?: 'revenue' | 'expense';
    dateFrom?: string;
    dateTo?: string;
    category?: string;
  }): Promise<FinancialTransaction[]> {
    const transactionsRef = collection(db, 'financialTransactions');
    
    const constraints: QueryConstraint[] = [
      where('userId', '==', filters.userId),
      orderBy('date', 'desc')
    ];
    
    let transactions = await safeQuery<FinancialTransaction>(
      transactionsRef,
      constraints,
      (a, b) => b.date.localeCompare(a.date)
    );
    
    // Filtrar em memória para evitar índices compostos
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    
    if (filters.dateFrom) {
      transactions = transactions.filter(t => t.date >= filters.dateFrom!);
    }
    
    if (filters.dateTo) {
      transactions = transactions.filter(t => t.date <= filters.dateTo!);
    }
    
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    
    return transactions;
  },

  // Buscar dashboard de lucratividade
  async getProfitabilityDashboard(userId: string, startDate?: string, endDate?: string): Promise<ProfitabilityDashboard> {
    const transactions = await this.getTransactions({
      userId,
      dateFrom: startDate,
      dateTo: endDate,
    });
    
    const revenue = transactions.filter(t => t.type === 'revenue' && t.status === 'completed');
    const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed');
    
    const totalRevenue = revenue.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    
    // Agrupar por categoria
    const revenueByCategory = revenue.reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);
    
    const expensesByCategory = expenses.reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);
    
    // Tendência mensal
    const monthlyTrend = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      let existing = acc.find(item => item.month === month);
      
      if (!existing) {
        existing = { month, revenue: 0, expenses: 0, profit: 0 };
        acc.push(existing);
      }
      
      if (t.type === 'revenue' && t.status === 'completed') {
        existing.revenue += t.amount;
      } else if (t.type === 'expense' && t.status === 'completed') {
        existing.expenses += t.amount;
      }
      existing.profit = existing.revenue - existing.expenses;
      
      return acc;
    }, [] as { month: string; revenue: number; expenses: number; profit: number }[]);
    
    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin,
      revenueByCategory,
      expensesByCategory,
      monthlyTrend: monthlyTrend.sort((a, b) => a.month.localeCompare(b.month)),
    };
  },
};

// ============ GESTÃO DE INSUMOS ============
export const supplyService = {
  // Criar insumo
  async createSupply(supplyData: Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supply> {
    const suppliesRef = collection(db, 'supplies');
    const data = prepareData({
      ...supplyData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(suppliesRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as Supply;
  },

  // Buscar insumos
  async getSupplies(filters?: { category?: string; lowStockOnly?: boolean }): Promise<Supply[]> {
    const suppliesRef = collection(db, 'supplies');
    
    const constraints: QueryConstraint[] = [
      where('isActive', '==', true),
      orderBy('name', 'asc')
    ];
    
    let supplies = await safeQuery<Supply>(
      suppliesRef,
      constraints,
      (a, b) => a.name.localeCompare(b.name)
    );
    
    // Filtrar em memória
    if (filters?.category) {
      supplies = supplies.filter(s => s.category === filters.category);
    }
    
    if (filters?.lowStockOnly) {
      supplies = supplies.filter(s => s.currentStock <= s.minStock);
    }
    
    return supplies;
  },

  // Atualizar estoque
  async updateStock(supplyId: string, quantity: number, reason: string, userId: string): Promise<void> {
    const supplyRef = doc(db, 'supplies', supplyId);
    const supplyDoc = await getDoc(supplyRef);
    
    if (!supplyDoc.exists()) {
      throw new Error('Insumo não encontrado');
    }
    
    const supply = convertFromFirestore(supplyDoc) as Supply;
    const newStock = supply.currentStock + quantity;
    
    await updateDoc(supplyRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp(),
    });
    
    // Registrar movimento
    const movementsRef = collection(db, 'supplyMovements');
    await addDoc(movementsRef, prepareData({
      supplyId,
      type: quantity > 0 ? 'entry' : 'exit',
      quantity: Math.abs(quantity),
      reason,
      userId,
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    }));
  },

  // Buscar alertas de estoque baixo
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    const supplies = await this.getSupplies({ lowStockOnly: true });
    
    return supplies.map(supply => ({
      id: `alert_${supply.id}`,
      supplyId: supply.id,
      supplyName: supply.name,
      currentStock: supply.currentStock,
      minStock: supply.minStock,
      severity: supply.currentStock === 0 ? 'critical' : 'low',
      isResolved: false,
      createdAt: new Date().toISOString(),
    }));
  },

  // Buscar relatórios de consumo
  async getConsumptionReports(supplyId?: string, days: number = 30): Promise<ConsumptionReport[]> {
    const movementsRef = collection(db, 'supplyMovements');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Usar apenas type para evitar múltiplos where
    const constraints: QueryConstraint[] = [
      where('type', '==', 'exit'),
    ];
    
    let movements: SupplyMovement[] = [];
    
    try {
      const q = query(movementsRef, ...constraints);
      const querySnapshot = await getDocs(q);
      movements = querySnapshot.docs.map(doc => convertFromFirestore(doc) as SupplyMovement);
    } catch (error: any) {
      // Se der erro, buscar todas e filtrar em memória
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        try {
          const querySnapshot = await getDocs(movementsRef);
          movements = querySnapshot.docs.map(doc => convertFromFirestore(doc) as SupplyMovement);
          // Filtrar apenas type='exit' em memória
          movements = movements.filter(m => m.type === 'exit');
        } catch (fallbackError: any) {
          return [];
        }
      } else {
        throw error;
      }
    }
    
    // Filtrar por data em memória
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    movements = movements.filter(m => m.date >= startDateStr && m.date <= endDateStr);
    
    // Filtrar por supplyId se fornecido
    if (supplyId) {
      movements = movements.filter(m => m.supplyId === supplyId);
    }
    
    // Agrupar por insumo
    const grouped = movements.reduce((acc, movement) => {
      if (!acc[movement.supplyId]) {
        acc[movement.supplyId] = {
          supplyId: movement.supplyId,
          supplyName: '', // Será preenchido depois
          quantityUsed: 0,
          period: `${days} dias`,
        };
      }
      acc[movement.supplyId].quantityUsed += movement.quantity;
      return acc;
    }, {} as Record<string, any>);
    
    // Buscar nomes dos insumos
    const supplies = await this.getSupplies();
    const reports: ConsumptionReport[] = [];
    
    for (const [supplyId, data] of Object.entries(grouped)) {
      const supply = supplies.find(s => s.id === supplyId);
      if (supply) {
        const averageDaily = data.quantityUsed / days;
        const estimatedDays = supply.currentStock / averageDaily;
        
        reports.push({
          id: `report_${supplyId}`,
          supplyId,
          supplyName: supply.name,
          period: data.period,
          quantityUsed: data.quantityUsed,
          averageDailyConsumption: averageDaily,
          estimatedDaysUntilDepletion: estimatedDays,
          createdAt: new Date().toISOString(),
        });
      }
    }
    
    return reports;
  },
};

// ============ RESULTADOS DE EXAMES ============
export const examService = {
  // Criar resultado de exame
  async createExamResult(examData: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExamResult> {
    const examsRef = collection(db, 'examResults');
    const data = prepareData({
      ...examData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const docRef = await addDoc(examsRef, data);
    const docSnap = await getDoc(docRef);
    
    return convertFromFirestore(docSnap) as ExamResult;
  },

  // Buscar resultados de exame
  async getExamResults(filters: {
    patientId?: string;
    professionalId?: string;
    status?: string;
  }): Promise<ExamResult[]> {
    const examsRef = collection(db, 'examResults');
    const constraints: QueryConstraint[] = [];
    
    // Usar apenas um campo de filtro principal
    if (filters.patientId) {
      constraints.push(where('patientId', '==', filters.patientId));
    } else if (filters.professionalId) {
      constraints.push(where('professionalId', '==', filters.professionalId));
    }
    
    let results: ExamResult[] = [];
    
    if (constraints.length > 0) {
      const queryConstraints: QueryConstraint[] = [
        ...constraints,
        orderBy('examDate', 'desc')
      ];
      
      results = await safeQuery<ExamResult>(
        examsRef,
        queryConstraints,
        (a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
      );
    } else {
      // Sem filtros, buscar todas e ordenar em memória
      try {
        const querySnapshot = await getDocs(examsRef);
        results = querySnapshot.docs.map(doc => convertFromFirestore(doc) as ExamResult);
        results.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
      } catch (error: any) {
        return [];
      }
    }
    
    // Filtrar status em memória
    if (filters.status) {
      results = results.filter(r => r.status === filters.status);
    }
    
    return results;
  },

  // Compartilhar resultado
  async shareExamResult(examId: string, isShared: boolean): Promise<void> {
    const examRef = doc(db, 'examResults', examId);
    await updateDoc(examRef, {
      isShared,
      updatedAt: serverTimestamp(),
    });
  },
};

// ============ CONFIRMAÇÃO AUTOMÁTICA ============
export const autoConfirmationService = {
  // Criar ou atualizar configurações
  async saveSettings(settings: Omit<AutoConfirmationSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutoConfirmationSettings> {
    const settingsRef = collection(db, 'autoConfirmationSettings');
    let existingDocs;
    try {
      const existingQuery = query(settingsRef, where('userId', '==', settings.userId));
      existingDocs = await getDocs(existingQuery);
    } catch (error: any) {
      // Se der erro de índice, continuar sem verificar existência
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        existingDocs = { empty: true, docs: [] } as any;
      } else {
        throw error;
      }
    }
    
    const data = prepareData({
      ...settings,
      updatedAt: serverTimestamp(),
    });
    
    if (!existingDocs.empty) {
      const existingDoc = existingDocs.docs[0];
      await updateDoc(existingDoc.ref, data);
      const updatedDoc = await getDoc(existingDoc.ref);
      return convertFromFirestore(updatedDoc) as AutoConfirmationSettings;
    } else {
      data.createdAt = serverTimestamp();
      const docRef = await addDoc(settingsRef, data);
      const docSnap = await getDoc(docRef);
      return convertFromFirestore(docSnap) as AutoConfirmationSettings;
    }
  },

  // Buscar configurações
  async getSettings(userId: string): Promise<AutoConfirmationSettings | null> {
    const settingsRef = collection(db, 'autoConfirmationSettings');
    try {
      const q = query(settingsRef, where('userId', '==', userId), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return convertFromFirestore(querySnapshot.docs[0]) as AutoConfirmationSettings;
    } catch (error: any) {
      // Se der erro de índice, tentar sem limit
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        try {
          const q = query(settingsRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            return null;
          }
          
          return convertFromFirestore(querySnapshot.docs[0]) as AutoConfirmationSettings;
        } catch (fallbackError: any) {
          return null;
        }
      }
      throw error;
    }
  },
};

