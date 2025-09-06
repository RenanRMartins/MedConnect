import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Stethoscope, ArrowLeft } from 'lucide-react';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { AppointmentForm, Professional, Hospital, Specialty } from '@/types';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const NewAppointmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { createAppointment, fetchAvailableSlots } = useAppointmentStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AppointmentForm>();

  const selectedSpecialty = watch('specialty');

  // Simular carregamento de dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simular dados de especialidades
      setTimeout(() => {
        setSpecialties([
          { id: '1', name: 'Cardiologia', description: 'Especialidade do coração', icon: '❤️', color: '#ef4444', isActive: true },
          { id: '2', name: 'Dermatologia', description: 'Especialidade da pele', icon: '🧴', color: '#f59e0b', isActive: true },
          { id: '3', name: 'Pediatria', description: 'Especialidade infantil', icon: '👶', color: '#10b981', isActive: true },
          { id: '4', name: 'Ginecologia', description: 'Especialidade feminina', icon: '👩', color: '#8b5cf6', isActive: true },
          { id: '5', name: 'Ortopedia', description: 'Especialidade dos ossos', icon: '🦴', color: '#06b6d4', isActive: true },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  // Carregar profissionais quando especialidade for selecionada
  useEffect(() => {
    if (selectedSpecialty) {
      // Simular carregamento de profissionais
      setTimeout(() => {
        setProfessionals([
          {
            id: '1',
            name: 'Dr. João Silva',
            email: 'joao@medconnect.com',
            phone: '(11) 99999-9999',
            cpf: '123.456.789-00',
            birthDate: '1980-01-01',
            gender: 'M' as const,
            role: 'professional' as const,
            isActive: true,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            crm: '123456',
            specialties: [selectedSpecialty],
            experience: 15,
            rating: 4.8,
            totalReviews: 120,
            bio: 'Especialista em cardiologia com 15 anos de experiência',
            consultationPrice: 200,
            availableSlots: [],
            hospitalAffiliations: ['1', '2'],
          },
          {
            id: '2',
            name: 'Dra. Maria Santos',
            email: 'maria@medconnect.com',
            phone: '(11) 88888-8888',
            cpf: '987.654.321-00',
            birthDate: '1975-05-15',
            gender: 'F' as const,
            role: 'professional' as const,
            isActive: true,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            crm: '654321',
            specialties: [selectedSpecialty],
            experience: 20,
            rating: 4.9,
            totalReviews: 200,
            bio: 'Especialista em cardiologia com 20 anos de experiência',
            consultationPrice: 250,
            availableSlots: [],
            hospitalAffiliations: ['1', '3'],
          },
        ]);
      }, 500);
    }
  }, [selectedSpecialty]);

  // Carregar hospitais quando profissional for selecionado
  useEffect(() => {
    if (selectedProfessional) {
      // Simular carregamento de hospitais
      setTimeout(() => {
        setHospitals([
          {
            id: '1',
            name: 'Hospital São Paulo',
            address: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            phone: '(11) 3333-3333',
            specialties: [selectedSpecialty],
            rating: 4.7,
            totalReviews: 500,
            facilities: ['UTI', 'Emergência', 'Laboratório'],
            isActive: true,
          },
          {
            id: '2',
            name: 'Hospital das Clínicas',
            address: 'Av. Paulista, 456',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100',
            phone: '(11) 4444-4444',
            specialties: [selectedSpecialty],
            rating: 4.8,
            totalReviews: 800,
            facilities: ['UTI', 'Emergência', 'Laboratório', 'Fisioterapia'],
            isActive: true,
          },
        ]);
      }, 500);
    }
  }, [selectedProfessional, selectedSpecialty]);

  // Carregar horários disponíveis quando data for selecionada
  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      // Simular carregamento de horários
      setTimeout(() => {
        setAvailableSlots([
          '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        ]);
      }, 300);
    }
  }, [selectedDate, selectedProfessional]);

  const onSubmit = async (data: AppointmentForm) => {
    console.log('Form submitted with data:', data);
    console.log('Selected professional:', selectedProfessional);
    console.log('Selected hospital:', selectedHospital);
    console.log('Selected date:', selectedDate);
    console.log('Selected time:', selectedTime);
    
    setIsLoading(true);
    
    const success = await createAppointment({
      ...data,
      professionalId: selectedProfessional?.id || '',
      hospitalId: selectedHospital?.id || '',
      date: selectedDate,
      time: selectedTime,
    });

    if (success) {
      navigate('/appointments');
    }
    
    setIsLoading(false);
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Especialidade', description: 'Escolha a especialidade' },
    { id: 2, title: 'Profissional', description: 'Selecione o médico' },
    { id: 3, title: 'Local e Data', description: 'Escolha hospital e horário' },
    { id: 4, title: 'Detalhes', description: 'Informações adicionais' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/appointments')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Agendar Consulta</h1>
              <p className="text-gray-600 dark:text-dark-300 mt-2">
                Preencha as informações para agendar sua consulta
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepItem.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepItem.id}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {stepItem.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stepItem.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
            <CardHeader title={`Passo ${step}: ${steps[step - 1].title}`} />
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" text="Carregando..." />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Step 1: Especialidade */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specialties.map((specialty) => (
                          <button
                            key={specialty.id}
                            type="button"
                            onClick={() => {
                              setValue('specialty', specialty.name);
                              nextStep();
                            }}
                            className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                              selectedSpecialty === specialty.name
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{specialty.icon}</span>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-dark-100">
                                  {specialty.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-dark-400">
                                  {specialty.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Profissional */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {professionals.map((professional) => (
                        <button
                          key={professional.id}
                          type="button"
                          onClick={() => {
                            setSelectedProfessional(professional);
                            nextStep();
                          }}
                          className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                            selectedProfessional?.id === professional.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {professional.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                CRM: {professional.crm} • {professional.experience} anos de experiência
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-400">★</span>
                                  <span className="text-sm text-gray-600">
                                    {professional.rating} ({professional.totalReviews} avaliações)
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  R$ {professional.consultationPrice}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 3: Local e Data */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Hospital */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Escolha o hospital
                        </label>
                        <div className="space-y-3">
                          {hospitals.map((hospital) => (
                            <button
                              key={hospital.id}
                              type="button"
                              onClick={() => setSelectedHospital(hospital)}
                              className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                                selectedHospital?.id === hospital.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {hospital.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {hospital.address}, {hospital.city} - {hospital.state}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-yellow-400">★</span>
                                      <span className="text-sm text-gray-600">
                                        {hospital.rating} ({hospital.totalReviews} avaliações)
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {hospital.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Data */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Escolha a data
                        </label>
                        <Input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          leftIcon={<Calendar className="w-4 h-4" />}
                        />
                      </div>

                      {/* Horário */}
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Escolha o horário
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {availableSlots.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                                  selectedTime === time
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Detalhes */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Tipo de consulta
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: 'consultation', label: 'Consulta', icon: Stethoscope },
                            { value: 'follow-up', label: 'Retorno', icon: Calendar },
                            { value: 'emergency', label: 'Emergência', icon: Clock },
                            { value: 'telemedicine', label: 'Teleconsulta', icon: User },
                          ].map((type) => (
                            <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer">
                              <input
                                type="radio"
                                value={type.value}
                                className="sr-only"
                                {...register('type', { required: 'Tipo de consulta é obrigatório' })}
                              />
                              <type.icon className="w-5 h-5 mr-3 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {type.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.type && (
                          <p className="text-sm text-danger-600 mt-1">
                            {errors.type.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Sintomas ou motivo da consulta
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={4}
                          placeholder="Descreva seus sintomas ou o motivo da consulta..."
                          {...register('symptoms')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Observações adicionais
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                          placeholder="Alguma informação adicional que gostaria de compartilhar..."
                          {...register('notes')}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter align="between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Voltar
              </Button>
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !selectedSpecialty) ||
                    (step === 2 && !selectedProfessional) ||
                    (step === 3 && (!selectedHospital || !selectedDate || !selectedTime))
                  }
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!selectedProfessional || !selectedHospital || !selectedDate || !selectedTime}
                >
                  Agendar Consulta
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default NewAppointmentPage;
