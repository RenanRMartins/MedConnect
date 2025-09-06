import React from 'react';
import { useUserRoleContext } from '@/contexts/UserRoleContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { selectedRole } = useUserRoleContext();

  // Renderizar dashboard baseado no tipo de usuário selecionado
  if (selectedRole === 'doctor') {
    return <DoctorDashboard />;
  }

  // Por padrão, renderizar dashboard de paciente
  return <PatientDashboard />;
};

export default Dashboard;