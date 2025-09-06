import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Calendar, User, Download, Plus, Stethoscope, Clock, MapPin, Star, Phone, Mail, MapPin as MapPinIcon } from 'lucide-react';

const PatientMedicalHistoryPage: React.FC = () => {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'consultation',
    title: '',
    description: '',
    date: '',
    doctor: '',
    hospital: ''
  });

  const medicalRecords = [
    {
      id: 1,
      type: 'consultation',
      title: 'Consulta de Cardiologia',
      description: 'Consulta de rotina com Dr. João Silva. Pressão arterial normal, sem alterações no ECG.',
      date: '14/01/2024',
      doctor: 'Dr. João Silva',
      hospital: 'Hospital São Paulo',
      status: 'completed'
    },
    {
      id: 2,
      type: 'exam',
      title: 'Exame de Sangue',
      description: 'Hemograma completo, glicemia, colesterol. Todos os valores dentro da normalidade.',
      date: '09/01/2024',
      doctor: 'Dr. Maria Santos',
      hospital: 'Laboratório Central',
      status: 'completed'
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Prescrição Médica',
      description: 'Losartana 50mg - 1 comprimido ao dia pela manhã',
      date: '14/01/2024',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar o novo registro
    console.log('Novo registro:', newRecord);
    setShowAddRecord(false);
    setNewRecord({
      type: 'consultation',
      title: '',
      description: '',
      date: '',
      doctor: '',
      hospital: ''
    });
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Meu Histórico Médico</h1>
          <p className="text-gray-600 dark:text-dark-300 mt-2">
            Visualize e gerencie seu histórico médico pessoal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader 
                title="Meus Registros Médicos" 
                action={
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddRecord(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                }
              />
              <CardContent>
                {showAddRecord && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-100">Adicionar Novo Registro</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Tipo</label>
                          <select
                            value={newRecord.type}
                            onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          >
                            <option value="consultation">Consulta</option>
                            <option value="exam">Exame</option>
                            <option value="prescription">Prescrição</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Data</label>
                          <input
                            type="date"
                            value={newRecord.date}
                            onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Título</label>
                        <input
                          type="text"
                          value={newRecord.title}
                          onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                          placeholder="Ex: Consulta de Cardiologia"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Descrição</label>
                        <textarea
                          value={newRecord.description}
                          onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                          placeholder="Descreva o procedimento ou resultado..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Médico</label>
                          <input
                            type="text"
                            value={newRecord.doctor}
                            onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                            placeholder="Nome do médico"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Local</label>
                          <input
                            type="text"
                            value={newRecord.hospital}
                            onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})}
                            placeholder="Nome do local"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddRecord(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Adicionar Registro
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {medicalRecords.map((record) => {
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
              <CardHeader title="Resumo" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Consultas realizadas</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Exames realizados</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-400">Prescrições</span>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">1</span>
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
                    Exportar Histórico
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Adicionar Exame
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Consulta
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

export default PatientMedicalHistoryPage;
