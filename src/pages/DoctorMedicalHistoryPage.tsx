import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Calendar, User, Download, Plus, Stethoscope, Clock, MapPin, Star, Phone, Mail, Search, Filter } from 'lucide-react';

const DoctorMedicalHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const patients = [
    { id: 1, name: 'Maria Silva', age: 45, lastVisit: '15/01/2024' },
    { id: 2, name: 'João Santos', age: 38, lastVisit: '12/01/2024' },
    { id: 3, name: 'Ana Costa', age: 52, lastVisit: '10/01/2024' },
    { id: 4, name: 'Pedro Oliveira', age: 29, lastVisit: '08/01/2024' }
  ];

  const medicalRecords = [
    {
      id: 1,
      patient: 'Maria Silva',
      type: 'consultation',
      title: 'Consulta de Cardiologia',
      description: 'Paciente com hipertensão controlada. Pressão arterial 120/80. ECG normal.',
      date: '15/01/2024',
      doctor: 'Dr. João Silva',
      hospital: 'Hospital São Paulo',
      status: 'completed'
    },
    {
      id: 2,
      patient: 'João Santos',
      type: 'exam',
      title: 'Exame de Sangue',
      description: 'Hemograma completo. Glicemia 95mg/dl, colesterol total 180mg/dl.',
      date: '12/01/2024',
      doctor: 'Dr. Maria Santos',
      hospital: 'Laboratório Central',
      status: 'completed'
    },
    {
      id: 3,
      patient: 'Ana Costa',
      type: 'prescription',
      title: 'Prescrição Médica',
      description: 'Metformina 500mg - 2x ao dia. Losartana 50mg - 1x ao dia.',
      date: '10/01/2024',
      doctor: 'Dr. João Silva',
      hospital: 'Hospital São Paulo',
      status: 'active'
    }
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'exam': return FileText;
      case 'prescription': return Calendar;
      default: return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400';
      case 'exam': return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
      case 'prescription': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredRecords = medicalRecords.filter(record => 
    record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Histórico Médico dos Pacientes</h1>
          <p className="text-gray-600 dark:text-dark-300 mt-2">
            Gerencie e visualize o histórico médico de seus pacientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader 
                title="Registros Médicos dos Pacientes"
                action={
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar paciente ou procedimento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                }
              />
              <CardContent>
                <div className="space-y-4">
                  {filteredRecords.map((record) => {
                    const Icon = getRecordIcon(record.type);
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${getRecordColor(record.type)}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">{record.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status === 'completed' ? 'Concluído' : record.status === 'active' ? 'Ativo' : 'Pendente'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-dark-300 mb-2">
                              <strong>Paciente:</strong> {record.patient}
                            </p>
                            <p className="text-gray-600 dark:text-dark-300 mb-4">{record.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-dark-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{record.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{record.doctor}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{record.hospital}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Pacientes Ativos" />
              <CardContent>
                <div className="space-y-3">
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-dark-100">{patient.name}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-400">{patient.age} anos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-dark-400">Última visita</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-100">{patient.lastVisit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Estatísticas" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Pacientes atendidos</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Consultas hoje</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Exames solicitados</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Ações Rápidas" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Nova Consulta
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Retorno
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorMedicalHistoryPage;
