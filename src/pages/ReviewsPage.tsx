import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Star, MessageCircle, ThumbsUp, ThumbsDown, User, Calendar, Stethoscope, Phone, Mail, MapPin as MapPinIcon } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    doctor: '',
    rating: 5,
    comment: '',
    appointment: ''
  });

  const reviews = [
    {
      id: 1,
      doctor: 'Dr. João Silva',
      specialty: 'Cardiologia',
      rating: 5,
      comment: 'Excelente profissional! Muito atencioso e explicou tudo detalhadamente. Recomendo!',
      date: '2024-01-15',
      appointment: 'Consulta de Cardiologia',
      hospital: 'Hospital São Paulo'
    },
    {
      id: 2,
      doctor: 'Dra. Maria Santos',
      specialty: 'Dermatologia',
      rating: 4,
      comment: 'Boa consulta, diagnóstico preciso. Apenas a espera foi um pouco longa.',
      date: '2024-01-10',
      appointment: 'Consulta de Dermatologia',
      hospital: 'Hospital das Clínicas'
    }
  ];

  const pendingReviews = [
    {
      id: 1,
      doctor: 'Dr. Carlos Oliveira',
      specialty: 'Ortopedia',
      appointment: 'Consulta de Ortopedia',
      date: '2024-01-20',
      hospital: 'Hospital São Paulo'
    }
  ];

  const handleSubmitReview = () => {
    if (newReview.doctor && newReview.comment) {
      console.log('Avaliação enviada:', newReview);
      setShowReviewForm(false);
      setNewReview({
        doctor: '',
        rating: 5,
        comment: '',
        appointment: ''
      });
      alert('Avaliação enviada com sucesso!');
    } else {
      alert('Preencha todos os campos obrigatórios');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Avaliações</h1>
          <p className="text-gray-600 mt-2">
            Avalie os profissionais e veja as avaliações de outros pacientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader 
                title="Minhas Avaliações" 
                action={
                  <Button 
                    onClick={() => setShowReviewForm(true)}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nova Avaliação
                  </Button>
                }
              />
              <CardContent>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gray-50 rounded-lg border"
                  >
                    <h3 className="text-lg font-semibold mb-4">Avaliar Profissional</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                          <select
                            value={newReview.doctor}
                            onChange={(e) => setNewReview({...newReview, doctor: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Selecione um profissional</option>
                            <option value="Dr. João Silva">Dr. João Silva - Cardiologia</option>
                            <option value="Dra. Maria Santos">Dra. Maria Santos - Dermatologia</option>
                            <option value="Dr. Carlos Oliveira">Dr. Carlos Oliveira - Ortopedia</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Consulta</label>
                          <input
                            type="text"
                            value={newReview.appointment}
                            onChange={(e) => setNewReview({...newReview, appointment: e.target.value})}
                            placeholder="Ex: Consulta de Cardiologia"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
                        <div className="flex items-center space-x-1 mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setNewReview({...newReview, rating: i + 1})}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {newReview.rating} estrela{newReview.rating > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          placeholder="Conte sua experiência com este profissional..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleSubmitReview}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          Enviar Avaliação
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma avaliação encontrada
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Suas avaliações aparecerão aqui após as consultas
                      </p>
                      <Button 
                        onClick={() => setShowReviewForm(true)}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Avaliar Consulta
                      </Button>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {review.doctor}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {review.specialty} • {review.hospital}
                            </p>
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Stethoscope className="w-4 h-4" />
                                <span>{review.appointment}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Avaliações Pendentes" />
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma avaliação pendente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{review.doctor}</h4>
                            <p className="text-sm text-gray-600">{review.specialty}</p>
                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => setShowReviewForm(true)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Avaliar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    onClick={() => alert('Filtrando avaliações positivas...')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Avaliações Positivas
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="justify-start"
                    onClick={() => alert('Filtrando avaliações negativas...')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Avaliações Negativas
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="justify-start"
                    onClick={() => alert('Mostrando todas as avaliações...')}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Ver Todas as Avaliações
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

export default ReviewsPage;
