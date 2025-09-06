import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  MoreVertical,
  Eye,
  Edit,
  X,
} from 'lucide-react';
import { Appointment } from '@/types';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface RecentAppointmentsProps {
  appointments: Appointment[];
  isLoading?: boolean;
  onViewAppointment?: (appointment: Appointment) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onCancelAppointment?: (appointment: Appointment) => void;
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  appointments,
  isLoading = false,
  onViewAppointment,
  onEditAppointment,
  onCancelAppointment,
}) => {
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Consultas Recentes" />
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Consultas Recentes" 
        action={
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
        }
      />
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma consulta encontrada</p>
            </div>
          ) : (
            appointments.slice(0, 5).map((appointment, index) => {
              const TypeIcon = getTypeIcon(appointment.type);
              const appointmentDate = parseISO(appointment.date);
              const appointmentTime = appointment.startTime;

              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getTypeText(appointment.type)} - {appointment.specialty}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(appointmentDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointmentTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">Hospital {appointment.hospitalId}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {onViewAppointment && (
                          <button
                            onClick={() => onViewAppointment(appointment)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Ver detalhes</span>
                          </button>
                        )}
                        {onEditAppointment && appointment.status === 'scheduled' && (
                          <button
                            onClick={() => onEditAppointment(appointment)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                        )}
                        {onCancelAppointment && 
                         (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <button
                            onClick={() => onCancelAppointment(appointment)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancelar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
