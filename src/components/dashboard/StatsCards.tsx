import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Star,
  DollarSign,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  const cards = [
    {
      title: 'Total de Consultas',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Próximas Consultas',
      value: stats.upcomingAppointments,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Consultas Concluídas',
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Consultas Canceladas',
      value: stats.cancelledAppointments,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-3%',
      changeType: 'negative' as const,
    },
    {
      title: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Avaliação Média',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+0.2',
      changeType: 'positive' as const,
    },
    {
      title: 'Novos Pacientes',
      value: stats.newPatients,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+20%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pacientes Retornantes',
      value: stats.returningPatients,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      change: '+7%',
      changeType: 'positive' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-medium ${
                      card.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white to-gray-50 rounded-full opacity-50"></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
