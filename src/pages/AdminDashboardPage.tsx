import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  TrendingUp,
  Shield,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/firebaseService';
import { appointmentService } from '@/services/firebaseService';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalPatients: 0,
    totalAppointments: 0,
    activeAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }

    const fetchStats = async () => {
      try {
        // Buscar todos os usuários
        const { collection, getDocs, query, where } = await import('firebase/firestore');
        const { db } = await import('@/services/firebase');
        
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const allUsers = usersSnapshot.docs.map(doc => doc.data());
        
        const professionals = allUsers.filter(u => u.role === 'professional');
        const patients = allUsers.filter(u => u.role === 'patient');
        
        // Buscar consultas - para admin, buscar todas sem filtros
        let appointments: any[] = [];
        let activeAppointments: any[] = [];
        try {
          appointments = await appointmentService.getAppointments({});
          activeAppointments = appointments.filter(a => 
            a.status === 'scheduled' || a.status === 'confirmed'
          );
        } catch (error) {
          // Se der erro (por exemplo, sem permissão), usar array vazio
          console.warn('Não foi possível carregar consultas:', error);
          appointments = [];
          activeAppointments = [];
        }

        setStats({
          totalUsers: allUsers.length,
          totalProfessionals: professionals.length,
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          activeAppointments: activeAppointments.length,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <Card>
          <CardContent>
            <p className="text-center text-red-600 dark:text-red-400">
              Acesso negado. Apenas administradores podem acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-dark-400 mt-2">
            Visão geral do sistema e gerenciamento
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Total de Usuários</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Profissionais</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                        {stats.totalProfessionals}
                      </p>
                    </div>
                    <Stethoscope className="w-12 h-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Pacientes</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                        {stats.totalPatients}
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Total de Consultas</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                        {stats.totalAppointments}
                      </p>
                    </div>
                    <Calendar className="w-12 h-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Consultas Ativas</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-dark-100">
                        {stats.activeAppointments}
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Status do Sistema</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Operacional
                      </p>
                    </div>
                    <Shield className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Ações Rápidas</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary-600" />
                        <span className="font-medium">Gerenciar Usuários</span>
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Configurações do Sistema</span>
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Relatórios e Analytics</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Informações do Sistema</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Versão</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Última Atualização</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">
                        {new Date().toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

