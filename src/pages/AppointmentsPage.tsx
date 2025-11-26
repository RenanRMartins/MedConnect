import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppointmentStore } from '@/stores/appointmentStore';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Appointment } from '@/types';
import {
  Calendar,
  Plus,
  Filter,
  Search,
  Clock,
  MapPin,
  User,
  Stethoscope,
  MoreVertical,
  Eye,
  Edit,
  X,
} from 'lucide-react';

const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    upcomingAppointments,
    pastAppointments,
    fetchAppointments,
    updateAppointment,
    cancelAppointment,
    isLoading,
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = React.useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingAppointment, setEditingAppointment] = React.useState<Appointment | null>(null);
  const [cancellingAppointment, setCancellingAppointment] = React.useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = React.useState('');
  const [editFormData, setEditFormData] = React.useState({
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      case 'no-show':
        return 'Não compareceu';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return Stethoscope;
      case 'follow-up':
        return Calendar;
      case 'emergency':
        return Clock;
      case 'telemedicine':
        return User;
      default:
        return Calendar;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'Consulta';
      case 'follow-up':
        return 'Retorno';
      case 'emergency':
        return 'Emergência';
      case 'telemedicine':
        return 'Teleconsulta';
      default:
        return type;
    }
  };

  const filteredAppointments = React.useMemo(() => {
    let filtered = appointments;

    if (activeTab === 'upcoming') {
      filtered = upcomingAppointments;
    } else if (activeTab === 'past') {
      filtered = pastAppointments;
    }

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [appointments, upcomingAppointments, pastAppointments, activeTab, searchTerm]);

  const tabs = [
    { id: 'all', label: 'Todas', count: appointments.length },
    { id: 'upcoming', label: 'Próximas', count: upcomingAppointments.length },
    { id: 'past', label: 'Passadas', count: pastAppointments.length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Carregando consultas..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Consultas</h1>
              <p className="text-gray-600 mt-2">
                Gerencie suas consultas médicas
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => window.location.href = '/appointments/new'}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent padding="md">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar por especialidade ou tipo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent padding="none">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma consulta encontrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? 'Tente ajustar seus filtros de busca'
                      : 'Comece agendando sua primeira consulta'}
                  </p>
                  <Button
                    onClick={() => window.location.href = '/appointments/new'}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => {
                    const TypeIcon = getTypeIcon(appointment.type);
                    const appointmentDate = new Date(appointment.date);
                    const appointmentTime = appointment.startTime;

                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-primary-600" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-medium text-gray-900">
                                {getTypeText(appointment.type)} - {appointment.specialty}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {getStatusText(appointment.status)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {appointmentDate.toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{appointmentTime}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Hospital {appointment.hospitalId}</span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                {appointment.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log('View appointment:', appointment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingAppointment(appointment);
                                setEditFormData({
                                  date: appointment.date,
                                  time: appointment.startTime,
                                  notes: appointment.notes || '',
                                });
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCancellingAppointment(appointment);
                                setCancelReason('');
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Modal Editar Consulta */}
        {editingAppointment && createPortal(
          <AnimatePresence>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setEditingAppointment(null);
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-100">Editar Consulta</h3>
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (editingAppointment) {
                    const success = await updateAppointment(editingAppointment.id, {
                      date: editFormData.date,
                      time: editFormData.time,
                      notes: editFormData.notes,
                    });
                    if (success) {
                      setEditingAppointment(null);
                      fetchAppointments();
                    }
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-dark-300">
                    Data
                  </label>
                  <Input
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-dark-300">
                    Horário
                  </label>
                  <Input
                    type="time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-dark-300">
                    Observações
                  </label>
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Adicione observações sobre a consulta..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700 text-white flex-1"
                  >
                    Salvar Alterações
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingAppointment(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}

        {/* Modal Cancelar Consulta */}
        {cancellingAppointment && createPortal(
          <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">Cancelar Consulta</h3>
              <p className="text-gray-600 dark:text-dark-400 mb-4">
                Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (cancellingAppointment) {
                    const success = await cancelAppointment(cancellingAppointment.id, cancelReason);
                    if (success) {
                      setCancellingAppointment(null);
                      setCancelReason('');
                      fetchAppointments();
                    }
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Motivo do Cancelamento (opcional)</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                    rows={3}
                    placeholder="Digite o motivo do cancelamento..."
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirmar Cancelamento
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCancellingAppointment(null);
                      setCancelReason('');
                    }}
                  >
                    Voltar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
          </AnimatePresence>,
          document.body
        )}
      </main>
    </div>
  );
};

export default AppointmentsPage;
