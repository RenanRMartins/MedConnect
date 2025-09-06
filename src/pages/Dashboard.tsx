import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { DashboardStats, Appointment } from '@/types';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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
  MapPin,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { 
    upcomingAppointments, 
    pastAppointments, 
    fetchUpcomingAppointments, 
    fetchPastAppointments,
    isLoading 
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

  useEffect(() => {
    // Carregar dados do dashboard
    fetchUpcomingAppointments();
    fetchPastAppointments();
    
    // Simular carregamento de estatísticas
    // Em uma aplicação real, isso viria de uma API
    setTimeout(() => {
      setStats({
        totalAppointments: 156,
        upcomingAppointments: upcomingAppointments.length,
        completedAppointments: 142,
        cancelledAppointments: 8,
        totalRevenue: 45600.00,
        averageRating: 4.8,
        newPatients: 23,
        returningPatients: 89,
      });
    }, 1000);
  }, [fetchUpcomingAppointments, fetchPastAppointments, upcomingAppointments.length]);

  const quickActions = [
    {
      title: 'Agendar Consulta',
      description: 'Marque uma nova consulta',
      icon: Plus,
      href: '/appointments/new',
      color: 'bg-primary-600 hover:bg-primary-700 shadow-lg',
    },
    {
      title: 'Ver Agenda',
      description: 'Visualize sua agenda',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-blue-600 hover:bg-blue-700 shadow-lg',
    },
    {
      title: 'Histórico Médico',
      description: 'Acesse seu histórico',
      icon: TrendingUp,
      href: '/medical-history',
      color: 'bg-green-600 hover:bg-green-700 shadow-lg',
    },
    {
      title: 'Suporte',
      description: 'Fale conosco',
      icon: Users,
      href: '/support',
      color: 'bg-purple-600 hover:bg-purple-700 shadow-lg',
    },
  ];

  const upcomingAppointmentsData = upcomingAppointments.slice(0, 5);
  const recentAppointmentsData = [...upcomingAppointments, ...pastAppointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.firstName || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo da sua atividade médica
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StatsCards stats={stats} isLoading={isLoading} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
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
                      onClick={() => window.location.href = action.href}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader 
                title="Próximas Consultas" 
                action={
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                }
              />
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointmentsData.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Nenhuma consulta agendada</p>
                      <Button
                        onClick={() => window.location.href = '/appointments/new'}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agendar Consulta
                      </Button>
                    </div>
                  ) : (
                    upcomingAppointmentsData.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg border border-primary-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {appointment.specialty}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.startTime}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {appointment.status === 'scheduled' ? 'Agendada' : 'Confirmada'}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader title="Atividade Recente" />
              <CardContent>
                <div className="space-y-4">
                  {recentAppointmentsData.slice(0, 4).map((appointment, index) => {
                    const getActivityIcon = (status: string) => {
                      switch (status) {
                        case 'completed':
                          return CheckCircle;
                        case 'cancelled':
                          return XCircle;
                        case 'scheduled':
                        case 'confirmed':
                          return Clock;
                        default:
                          return AlertCircle;
                      }
                    };

                    const getActivityColor = (status: string) => {
                      switch (status) {
                        case 'completed':
                          return 'text-green-600';
                        case 'cancelled':
                          return 'text-red-600';
                        case 'scheduled':
                        case 'confirmed':
                          return 'text-blue-600';
                        default:
                          return 'text-gray-600';
                      }
                    };

                    const ActivityIcon = getActivityIcon(appointment.status);

                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className={`flex-shrink-0 ${getActivityColor(appointment.status)}`}>
                          <ActivityIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {appointment.specialty} - {appointment.status === 'completed' ? 'Concluída' : 
                             appointment.status === 'cancelled' ? 'Cancelada' : 'Agendada'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(appointment.createdAt).toLocaleDateString('pt-BR')} às {new Date(appointment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <RecentAppointments
            appointments={recentAppointmentsData}
            isLoading={isLoading}
            onViewAppointment={(appointment) => {
              console.log('View appointment:', appointment);
            }}
            onEditAppointment={(appointment) => {
              console.log('Edit appointment:', appointment);
            }}
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
                <li><a href="/medical-history" className="text-gray-400 hover:text-white transition-colors">Histórico Médico</a></li>
                <li><a href="/reviews" className="text-gray-400 hover:text-white transition-colors">Avaliações</a></li>
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
                <li><a href="/medical-history" className="text-gray-400 hover:text-white transition-colors">Histórico Digital</a></li>
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
                  <MapPin className="w-5 h-5 text-primary-400" />
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

export default Dashboard;
