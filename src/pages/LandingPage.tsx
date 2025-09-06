import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Stethoscope, 
  Calendar, 
  Shield, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Activity,
  Smartphone,
  Globe,
  Award,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Sun,
  Moon
} from 'lucide-react';
import Button from '@/components/ui/Button';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const features = [
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sistema avançado de agendamento com disponibilidade em tempo real e confirmação automática.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Proteção de dados conforme LGPD com criptografia de ponta a ponta para máxima segurança.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Rede de Profissionais',
      description: 'Acesso a mais de 10.000 profissionais de saúde qualificados em todo o Brasil.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Star,
      title: 'Avaliações Reais',
      description: 'Sistema de avaliações transparente para ajudar na escolha do melhor profissional.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Clock,
      title: 'Lembretes Automáticos',
      description: 'Notificações inteligentes via SMS, e-mail e push para nunca perder uma consulta.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Activity,
      title: 'Histórico Digital',
      description: 'Seu prontuário médico digital sempre disponível e organizado na palma da mão.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Pacientes Atendidos' },
    { number: '10K+', label: 'Profissionais Cadastrados' },
    { number: '1M+', label: 'Consultas Realizadas' },
    { number: '4.9', label: 'Avaliação Média' }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Paciente',
      content: 'O MedConnect revolucionou minha experiência médica. Agendamento rápido, profissionais excelentes e atendimento humanizado.',
      rating: 5,
      avatar: 'MS'
    },
    {
      name: 'Dr. João Santos',
      role: 'Cardiologista',
      content: 'Plataforma incrível que me permite focar no que importa: cuidar dos meus pacientes. Interface intuitiva e funcionalidades completas.',
      rating: 5,
      avatar: 'JS'
    },
    {
      name: 'Ana Costa',
      role: 'Paciente',
      content: 'Nunca foi tão fácil agendar consultas. O sistema de lembretes é perfeito e os profissionais são muito qualificados.',
      rating: 5,
      avatar: 'AC'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-dark-100">MedConnect</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Recursos</a>
              <a href="#about" className="text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Sobre</a>
              <a href="#testimonials" className="text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Depoimentos</a>
              <a href="#contact" className="text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contato</a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                    Começar Agora
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Ir para Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-medical-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-dark-100 leading-tight">
                  Sua saúde em
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-medical-600">
                    {' '}primeiro lugar
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-dark-300 leading-relaxed">
                  Conectamos você aos melhores profissionais de saúde com agendamento inteligente, 
                  histórico digital e atendimento humanizado. Sua jornada para uma vida mais saudável começa aqui.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendar Consulta
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button 
                    size="lg" 
                    onClick={() => window.location.href = '/appointments/new'}
                    className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-4"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Consulta
                  </Button>
                </SignedIn>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Conhecer Recursos
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">100% Gratuito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Sem Taxas Ocultas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">LGPD Compliant</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-dark-700">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-primary-600 dark:text-primary-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-dark-100">Dr. Maria Santos</h3>
                      <p className="text-sm text-gray-500 dark:text-dark-400">Cardiologista</p>
                    </div>
                    <div className="ml-auto flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">4.9</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-dark-300">
                      <Calendar className="w-4 h-4" />
                      <span>Hoje, 14:30</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-dark-300">
                      <MapPin className="w-4 h-4" />
                      <span>Hospital São Paulo</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-dark-300">
                      <Clock className="w-4 h-4" />
                      <span>45 minutos</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        Confirmar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Reagendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Por que escolher o MedConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma experiência completa e inovadora para cuidar da sua saúde, 
              com tecnologia de ponta e atendimento humanizado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais de 500 mil pessoas já confiam no MedConnect para cuidar da sua saúde.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-medical-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para cuidar da sua saúde?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram sua experiência médica com o MedConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4">
                    <Calendar className="w-5 h-5 mr-2" />
                    Começar Agora
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Ir para Dashboard
                </Button>
              </SignedIn>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
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
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Depoimentos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Serviços</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Agendamento</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Teleconsulta</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Histórico Digital</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lembretes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte 24/7</a></li>
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
                  <MapPin className="w-5 h-5 text-primary-400" />
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
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Termos de Uso</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidade</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
