import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MessageCircle, Send, Phone, Mail, Clock, Stethoscope, Phone as PhoneIcon, Mail as MailIcon, MapPin as MapPinIcon } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'medium',
    description: '',
    category: 'general'
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Suporte MedConnect',
      message: 'Olá! Como posso ajudá-lo hoje?',
      timestamp: '10:30',
      isSupport: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const tickets = [
    {
      id: 1,
      subject: 'Problema com agendamento',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15',
      lastMessage: 'Não consigo agendar uma consulta para amanhã'
    },
    {
      id: 2,
      subject: 'Dúvida sobre histórico médico',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-10',
      lastMessage: 'Como visualizar meus exames anteriores?'
    }
  ];

  const faqItems = [
    {
      question: 'Como agendar uma consulta?',
      answer: 'Para agendar uma consulta, acesse o menu "Agendar" no dashboard, escolha a especialidade, selecione o profissional, data e horário disponíveis.'
    },
    {
      question: 'Como cancelar uma consulta?',
      answer: 'Você pode cancelar uma consulta acessando "Minhas Consultas", clicando na consulta desejada e selecionando "Cancelar".'
    },
    {
      question: 'Como visualizar meu histórico?',
      answer: 'Seu histórico médico está disponível no menu "Histórico Médico" onde você pode ver todas as consultas, exames e prescrições.'
    },
    {
      question: 'Como alterar meus dados?',
      answer: 'Acesse "Meu Perfil" no menu superior para editar suas informações pessoais e de contato.'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'Você',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isSupport: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simular resposta do suporte
      setTimeout(() => {
        const supportMessage = {
          id: messages.length + 2,
          sender: 'Suporte MedConnect',
          message: 'Obrigado pela sua mensagem! Nossa equipe analisará sua solicitação e retornará em breve.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isSupport: true
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 2000);
    }
  };

  const handleCreateTicket = () => {
    if (newTicket.subject && newTicket.description) {
      console.log('Ticket criado:', newTicket);
      setShowTicketForm(false);
      setNewTicket({
        subject: '',
        priority: 'medium',
        description: '',
        category: 'general'
      });
      alert('Ticket de suporte criado com sucesso!');
    } else {
      alert('Preencha todos os campos obrigatórios');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Suporte</h1>
          <p className="text-gray-600 dark:text-dark-300 mt-2">
            Estamos aqui para ajudar você com qualquer dúvida
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader 
                title="Chat de Suporte" 
                action={
                  <Button 
                    onClick={() => setShowTicketForm(true)}
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Novo Ticket
                  </Button>
                }
              />
              <CardContent>
                {showTicketForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-100">Criar Ticket de Suporte</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Assunto</label>
                        <input
                          type="text"
                          value={newTicket.subject}
                          onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                          placeholder="Descreva brevemente o problema"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Prioridade</label>
                          <select
                            value={newTicket.priority}
                            onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Categoria</label>
                          <select
                            value={newTicket.category}
                            onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          >
                            <option value="general">Geral</option>
                            <option value="technical">Técnico</option>
                            <option value="billing">Cobrança</option>
                            <option value="appointment">Agendamento</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Descrição</label>
                        <textarea
                          value={newTicket.description}
                          onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                          placeholder="Descreva detalhadamente o problema ou dúvida..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleCreateTicket}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          Criar Ticket
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowTicketForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSupport ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isSupport
                              ? 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100'
                              : 'bg-primary-600 text-white'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">{message.sender}</p>
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Meus Tickets" />
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-dark-800">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-dark-100">{ticket.subject}</h3>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in-progress' ? 'Em Andamento' : 'Resolvido'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-dark-300 mb-2">{ticket.lastMessage}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-400">Criado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Contato" />
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-100">Telefone</p>
                      <p className="text-sm text-gray-600 dark:text-dark-300">(11) 9999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-100">E-mail</p>
                      <p className="text-sm text-gray-600 dark:text-dark-300">suporte@medconnect.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-100">Horário</p>
                      <p className="text-sm text-gray-600 dark:text-dark-300">24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="FAQ" />
              <CardContent>
                <div className="space-y-3">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-dark-700 pb-3 last:border-b-0">
                      <button
                        onClick={() => alert(item.answer)}
                        className="text-left w-full hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <p className="font-medium text-sm text-gray-900 dark:text-dark-100">{item.question}</p>
                      </button>
                    </div>
                  ))}
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

export default SupportPage;
