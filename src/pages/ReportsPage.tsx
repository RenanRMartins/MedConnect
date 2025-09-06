import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Download,
  Filter,
  Stethoscope,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reports = [
    {
      id: 1,
      title: 'Relatório de Consultas',
      description: 'Análise detalhada das consultas realizadas',
      icon: Calendar,
      data: {
        total: 156,
        completed: 142,
        cancelled: 8,
        pending: 6
      }
    },
    {
      id: 2,
      title: 'Relatório Financeiro',
      description: 'Receitas e despesas do período',
      icon: DollarSign,
      data: {
        revenue: 45600,
        expenses: 12000,
        profit: 33600,
        growth: 15
      }
    },
    {
      id: 3,
      title: 'Relatório de Pacientes',
      description: 'Estatísticas de pacientes atendidos',
      icon: Users,
      data: {
        total: 89,
        new: 23,
        returning: 66,
        satisfaction: 4.8
      }
    }
  ];

  const monthlyData = [
    { month: 'Jan', consultations: 120, revenue: 35000 },
    { month: 'Fev', consultations: 135, revenue: 38000 },
    { month: 'Mar', consultations: 142, revenue: 41000 },
    { month: 'Abr', consultations: 156, revenue: 45600 },
  ];

  const handleDownloadReport = (reportType: string) => {
    alert(`Baixando relatório: ${reportType}`);
  };

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
            Relatórios e Análises
          </h1>
          <p className="text-gray-600 dark:text-dark-300">
            Visualize métricas e gere relatórios detalhados da sua prática médica
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Período
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                  >
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mês</option>
                    <option value="quarter">Este Trimestre</option>
                    <option value="year">Este Ano</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Tipo de Relatório
                  </label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                  >
                    <option value="overview">Visão Geral</option>
                    <option value="consultations">Consultas</option>
                    <option value="financial">Financeiro</option>
                    <option value="patients">Pacientes</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cards de Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                            {report.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-dark-400">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.title)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(report.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-dark-300 capitalize">
                            {key === 'revenue' ? 'Receita' : 
                             key === 'expenses' ? 'Despesas' :
                             key === 'profit' ? 'Lucro' :
                             key === 'growth' ? 'Crescimento' :
                             key === 'total' ? 'Total' :
                             key === 'completed' ? 'Concluídas' :
                             key === 'cancelled' ? 'Canceladas' :
                             key === 'pending' ? 'Pendentes' :
                             key === 'new' ? 'Novos' :
                             key === 'returning' ? 'Retornantes' :
                             key === 'satisfaction' ? 'Satisfação' : key}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                            {key === 'revenue' || key === 'expenses' || key === 'profit' ? 
                              `R$ ${value.toLocaleString('pt-BR')}` :
                              key === 'growth' ? `${value}%` :
                              key === 'satisfaction' ? `${value}/5` :
                              value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Gráfico de Tendências */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader title="Tendências Mensais" />
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-dark-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 dark:text-dark-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">
                    Gráfico de Tendências
                  </h3>
                  <p className="text-gray-500 dark:text-dark-400">
                    Visualização interativa dos dados será implementada em breve
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader title="Ações Rápidas" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleDownloadReport('Relatório Completo')}
                >
                  <Download className="w-6 h-6" />
                  <span>Relatório Completo</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleDownloadReport('Relatório Financeiro')}
                >
                  <DollarSign className="w-6 h-6" />
                  <span>Relatório Financeiro</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleDownloadReport('Relatório de Pacientes')}
                >
                  <Users className="w-6 h-6" />
                  <span>Relatório de Pacientes</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleDownloadReport('Relatório de Consultas')}
                >
                  <Calendar className="w-6 h-6" />
                  <span>Relatório de Consultas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-800 text-white py-12 mt-16">
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
                <li><a href="/patients" className="text-gray-400 hover:text-white transition-colors">Meus Pacientes</a></li>
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
                <li><a href="/reports" className="text-gray-400 hover:text-white transition-colors">Relatórios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lembretes</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Suporte 24/7</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">(11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MailIcon className="w-5 h-5 text-primary-400" />
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

export default ReportsPage;
