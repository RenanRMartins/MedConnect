import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Calendar, User, Download, Plus, Stethoscope, Clock, MapPin, Star, Phone, Mail, MapPin as MapPinIcon } from 'lucide-react';

const MedicalHistoryPage: React.FC = () => {
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
      date: '2024-01-15',
      doctor: 'Dr. João Silva',
      hospital: 'Hospital São Paulo',
      status: 'completed'
    },
    {
      id: 2,
      type: 'exam',
      title: 'Exame de Sangue',
      description: 'Hemograma completo, glicemia, colesterol. Todos os valores dentro da normalidade.',
      date: '2024-01-10',
      doctor: 'Dr. Maria Santos',
      hospital: 'Laboratório Central',
      status: 'completed'
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Prescrição Médica',
      description: 'Losartana 50mg - 1 comprimido ao dia pela manhã',
      date: '2024-01-15',
      doctor: 'Dr. João Silva',
      hospital: 'Hospital São Paulo',
      status: 'active'
    }
  ];

  const handleAddRecord = () => {
    if (newRecord.title && newRecord.description && newRecord.date) {
      // Simular adição de registro
      console.log('Adicionando registro:', newRecord);
      setShowAddRecord(false);
      setNewRecord({
        type: 'consultation',
        title: '',
        description: '',
        date: '',
        doctor: '',
        hospital: ''
      });
      alert('Registro adicionado com sucesso!');
    } else {
      alert('Preencha todos os campos obrigatórios');
    }
  };

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
      case 'consultation': return 'text-blue-600 bg-blue-50';
      case 'exam': return 'text-green-600 bg-green-50';
      case 'prescription': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Histórico Médico</h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie seu histórico médico digital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader 
                title="Registros Médicos" 
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
                    className="mb-6 p-4 bg-gray-50 rounded-lg border"
                  >
                    <h3 className="text-lg font-semibold mb-4">Adicionar Novo Registro</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                          <select
                            value={newRecord.type}
                            onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="consultation">Consulta</option>
                            <option value="exam">Exame</option>
                            <option value="prescription">Prescrição</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                          <input
                            type="date"
                            value={newRecord.date}
                            onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                          type="text"
                          value={newRecord.title}
                          onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                          placeholder="Ex: Consulta de Cardiologia"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                          value={newRecord.description}
                          onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                          placeholder="Descreva o procedimento ou resultado..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                          <input
                            type="text"
                            value={newRecord.doctor}
                            onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                            placeholder="Nome do médico"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clínica</label>
                          <input
                            type="text"
                            value={newRecord.hospital}
                            onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})}
                            placeholder="Nome do local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleAddRecord}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          Salvar Registro
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowAddRecord(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {medicalRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum registro encontrado
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Seus registros médicos aparecerão aqui após as consultas
                      </p>
                      <Button 
                        onClick={() => setShowAddRecord(true)}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Registro
                      </Button>
                    </div>
                  ) : (
                    medicalRecords.map((record) => {
                      const Icon = getRecordIcon(record.type);
                      return (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${getRecordColor(record.type)}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {record.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {record.status === 'completed' ? 'Concluído' : 'Ativo'}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">{record.description}</p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(record.date).toLocaleDateString('pt-BR')}</span>
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
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Resumo" />
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultas realizadas</span>
                    <span className="font-medium">{medicalRecords.filter(r => r.type === 'consultation').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Exames realizados</span>
                    <span className="font-medium">{medicalRecords.filter(r => r.type === 'exam').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prescrições</span>
                    <span className="font-medium">{medicalRecords.filter(r => r.type === 'prescription').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Ações Rápidas" />
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="justify-start"
                    onClick={() => alert('Funcionalidade de exportação em desenvolvimento')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Histórico
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="justify-start"
                    onClick={() => setShowAddRecord(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Adicionar Exame
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="justify-start"
                    onClick={() => window.location.href = '/appointments/new'}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default MedicalHistoryPage;
