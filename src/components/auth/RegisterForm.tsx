import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  Stethoscope, 
  GraduationCap,
  DollarSign,
  FileText
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { RegisterForm as RegisterFormType } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormType>({
    defaultValues: {
      role: 'patient',
    },
  });

  const role = watch('role');
  const password = watch('password');

  const onSubmit = async (data: RegisterFormType) => {
    clearError();
    const success = await registerUser(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  const nextStep = async () => {
    const isValid = await trigger([
      'name',
      'email',
      'password',
      'confirmPassword',
      'phone',
      'cpf',
      'birthDate',
      'gender',
      'role',
    ]);
    
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-medical-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card variant="elevated" className="overflow-hidden">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MedConnect</h1>
            <p className="text-gray-600">Crie sua conta para começar</p>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <div className={`w-8 h-2 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                <div className={`w-8 h-2 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-danger-50 border border-danger-200 rounded-lg p-4"
                >
                  <p className="text-sm text-danger-600">{error}</p>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações Pessoais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome completo"
                      placeholder="Seu nome completo"
                      leftIcon={<User className="w-4 h-4" />}
                      error={errors.name?.message}
                      {...register('name', {
                        required: 'Nome é obrigatório',
                        minLength: {
                          value: 2,
                          message: 'Nome deve ter pelo menos 2 caracteres',
                        },
                      })}
                    />

                    <Input
                      label="E-mail"
                      type="email"
                      placeholder="seu@email.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'E-mail é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'E-mail inválido',
                        },
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Senha"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      leftIcon={<Lock className="w-4 h-4" />}
                      isPassword
                      error={errors.password?.message}
                      {...register('password', {
                        required: 'Senha é obrigatória',
                        minLength: {
                          value: 6,
                          message: 'Senha deve ter pelo menos 6 caracteres',
                        },
                      })}
                    />

                    <Input
                      label="Confirmar senha"
                      type="password"
                      placeholder="Confirme sua senha"
                      leftIcon={<Lock className="w-4 h-4" />}
                      isPassword
                      error={errors.confirmPassword?.message}
                      {...register('confirmPassword', {
                        required: 'Confirmação de senha é obrigatória',
                        validate: (value) =>
                          value === password || 'Senhas não coincidem',
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Telefone"
                      placeholder="(11) 99999-9999"
                      leftIcon={<Phone className="w-4 h-4" />}
                      error={errors.phone?.message}
                      {...register('phone', {
                        required: 'Telefone é obrigatório',
                        pattern: {
                          value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                          message: 'Formato inválido',
                        },
                      })}
                    />

                    <Input
                      label="CPF"
                      placeholder="000.000.000-00"
                      leftIcon={<FileText className="w-4 h-4" />}
                      error={errors.cpf?.message}
                      {...register('cpf', {
                        required: 'CPF é obrigatório',
                        pattern: {
                          value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                          message: 'CPF inválido',
                        },
                      })}
                    />

                    <Input
                      label="Data de nascimento"
                      type="date"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      error={errors.birthDate?.message}
                      {...register('birthDate', {
                        required: 'Data de nascimento é obrigatória',
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gênero <span className="text-danger-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'M', label: 'Masculino' },
                          { value: 'F', label: 'Feminino' },
                          { value: 'O', label: 'Outro' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              value={option.value}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              {...register('gender', {
                                required: 'Gênero é obrigatório',
                              })}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-danger-600 mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de conta <span className="text-danger-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'patient', label: 'Paciente', icon: User },
                          { value: 'professional', label: 'Profissional', icon: Stethoscope },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                              role === option.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              value={option.value}
                              className="sr-only"
                              {...register('role', {
                                required: 'Tipo de conta é obrigatório',
                              })}
                            />
                            <option.icon className="w-5 h-5 mr-3 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.role && (
                        <p className="text-sm text-danger-600 mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && role === 'professional' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações Profissionais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="CRM"
                      placeholder="000000"
                      leftIcon={<GraduationCap className="w-4 h-4" />}
                      error={errors.crm?.message}
                      {...register('crm', {
                        required: 'CRM é obrigatório para profissionais',
                        pattern: {
                          value: /^\d{4,6}$/,
                          message: 'CRM inválido',
                        },
                      })}
                    />

                    <Input
                      label="Anos de experiência"
                      type="number"
                      placeholder="5"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      error={errors.experience?.message}
                      {...register('experience', {
                        required: 'Experiência é obrigatória',
                        min: {
                          value: 0,
                          message: 'Experiência deve ser maior ou igual a 0',
                        },
                      })}
                    />
                  </div>

                  <Input
                    label="Preço da consulta (R$)"
                    type="number"
                    placeholder="150.00"
                    leftIcon={<DollarSign className="w-4 h-4" />}
                    error={errors.consultationPrice?.message}
                    {...register('consultationPrice', {
                      required: 'Preço da consulta é obrigatório',
                      min: {
                        value: 0,
                        message: 'Preço deve ser maior que 0',
                      },
                    })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidades
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Cardiologia',
                        'Dermatologia',
                        'Pediatria',
                        'Ginecologia',
                        'Ortopedia',
                        'Neurologia',
                        'Psiquiatria',
                        'Oftalmologia',
                        'Otorrinolaringologia',
                        'Urologia',
                      ].map((specialty) => (
                        <label key={specialty} className="flex items-center">
                          <input
                            type="checkbox"
                            value={specialty}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            {...register('specialties')}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {specialty}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografia
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      placeholder="Conte um pouco sobre sua experiência e formação..."
                      {...register('bio')}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && role === 'patient' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações Adicionais
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alergias conhecidas
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Liste suas alergias conhecidas (opcional)"
                      {...register('allergies')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contato de emergência - Nome"
                      placeholder="Nome do contato"
                      leftIcon={<User className="w-4 h-4" />}
                      {...register('emergencyContact.name')}
                    />

                    <Input
                      label="Contato de emergência - Telefone"
                      placeholder="(11) 99999-9999"
                      leftIcon={<Phone className="w-4 h-4" />}
                      {...register('emergencyContact.phone')}
                    />
                  </div>

                  <Input
                    label="Parentesco"
                    placeholder="Pai, mãe, cônjuge, etc."
                    leftIcon={<User className="w-4 h-4" />}
                    {...register('emergencyContact.relationship')}
                  />
                </motion.div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('acceptTerms', {
                    required: 'Você deve aceitar os termos de uso',
                  })}
                />
                <span className="ml-2 text-sm text-gray-600">
                  Aceito os{' '}
                  <Link
                    to="/terms"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    to="/privacy"
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Política de Privacidade
                  </Link>
                </span>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-danger-600">{errors.acceptTerms.message}</p>
              )}

              <div className="flex space-x-4">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                )}
                
                {step === 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                    isLoading={isLoading}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isLoading}
                  >
                    Criar Conta
                  </Button>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter align="center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
