import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { DashboardStats, Appointment } from '@/types';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Calendar,
  Plus,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Stethoscope,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Heart,
  Activity,
  Pill,
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    upcomingAppointments, 
    pastAppointments, 
    fetchUpcomingAppointments, 
    fetchPastAppointments 
  } = useAppointmentStore();

  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalRevenue: 0,
    averageRating: 0,
    newPatients: 0,
    returningPatients: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUpcomingAppointments(),
        fetchPastAppointments(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchUpcomingAppointments, fetchPastAppointments]);

  useEffect(() => {
    // Atualizar estatísticas quando as consultas mudarem
    setStats({
      totalAppointments: upcomingAppointments.length + pastAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: pastAppointments.filter(apt => apt.status === 'completed').length,
      cancelledAppointments: pastAppointments.filter(apt => apt.status === 'cancelled').length,
      totalRevenue: 0, // Pacientes não veem receita
      averageRating: 4.8,
      newPatients: 0, // Pacientes não veem estatísticas de novos pacientes
      returningPatients: 0, // Pacientes não veem estatísticas de pacientes retornantes
    });
  }, [upcomingAppointments, pastAppointments]);

  const quickActions = [
    {
      title: 'Agendar Consulta',
      description: 'Marque uma nova consulta',
      icon: Plus,
      href: '/appointments/new',
      color: 'bg-primary-600 hover:bg-primary-700 shadow-lg',
      onClick: () => window.location.href = '/appointments/new'
    },
    {
      title: 'Ver Agenda',
      description: 'Visualize sua agenda',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-blue-600 hover:bg-blue-700 shadow-lg',
      onClick: () => window.location.href = '/appointments'
    },
    {
      title: 'Histórico Médico',
      description: 'Acesse seu histórico',
      icon: TrendingUp,
      href: '/patient-medical-history',
      color: 'bg-green-600 hover:bg-green-700 shadow-lg',
      onClick: () => window.location.href = '/patient-medical-history'
    },
    {
      title: 'Suporte',
      description: 'Fale conosco',
      icon: Users,
      href: '/support',
      color: 'bg-purple-600 hover:bg-purple-700 shadow-lg',
      onClick: () => window.location.href = '/support'
    },
  ];

  const upcomingAppointmentsData = upcomingAppointments.slice(0, 5);
  const recentAppointmentsData = [...upcomingAppointments, ...pastAppointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">
            Bem-vindo, {user?.firstName || 'Paciente'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-dark-300">
            Aqui está um resumo da sua saúde e consultas
          </p>
        </motion.div>

        {/* Estatísticas específicas para pacientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Total de Consultas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">{stats.totalAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Próximas Consultas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">{stats.upcomingAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Consultas Realizadas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">{stats.completedAppointments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Avaliação Média</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">{stats.averageRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
            <CardHeader title="Ações Rápidas" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <button
                      className={`w-full h-28 flex flex-col items-center justify-center space-y-3 rounded-xl ${action.color} text-white border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                      onClick={action.onClick}
                    >
                      <action.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-center">
                        <div className="font-semibold text-lg">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Próximas Consultas e Atividade Recente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <RecentAppointments
            appointments={upcomingAppointmentsData}
            title="Próximas Consultas"
            showViewAll={true}
            onViewAll={() => window.location.href = '/appointments'}
            onCancelAppointment={(appointment) => {
              console.log('Cancel appointment:', appointment);
            }}
          />

          <RecentAppointments
            appointments={recentAppointmentsData}
            title="Atividade Recente"
            showViewAll={false}
            onViewAll={() => {}}
            onCancelAppointment={(appointment) => {
              console.log('Cancel appointment:', appointment);
            }}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MedConnect</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Conectando você aos melhores profissionais de saúde com tecnologia de ponta e atendimento humanizado.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="/appointments" className="text-gray-400 hover:text-white transition-colors">Minhas Consultas</a></li>
                <li><a href="/patient-medical-history" className="text-gray-400 hover:text-white transition-colors">Histórico Médico</a></li>
                <li><a href="/patient-reviews" className="text-gray-400 hover:text-white transition-colors">Avaliações</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
                <li><a href="/profile" className="text-gray-400 hover:text-white transition-colors">Meu Perfil</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Serviços</h3>
              <ul className="space-y-3">
                <li><a href="/appointments/new" className="text-gray-400 hover:text-white transition-colors">Agendar Consulta</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Teleconsulta</a></li>
                <li><a href="/patient-medical-history" className="text-gray-400 hover:text-white transition-colors">Histórico Digital</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lembretes</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Suporte 24/7</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">(11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">contato@medconnect.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 MedConnect. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="https://renanrmartins.github.io/oficina-git/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Sobre Nós</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
