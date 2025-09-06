import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Star, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Clock, CheckCircle } from 'lucide-react';

const PatientReviewsPage: React.FC = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    doctor: '',
    appointment: '',
    rating: 5,
    comment: ''
  });

  const reviews = [
    {
      id: 1,
      doctor: 'Dr. João Silva',
      appointment: 'Consulta de Cardiologia',
      rating: 5,
      comment: 'Excelente atendimento! Muito atencioso e explicou tudo detalhadamente.',
      date: '15/01/2024',
      status: 'published'
    },
    {
      id: 2,
      doctor: 'Dr. Maria Santos',
      appointment: 'Exame de Sangue',
      rating: 4,
      comment: 'Profissional muito competente e prestativa.',
      date: '12/01/2024',
      status: 'published'
    }
  ];

  const pendingReviews = [
    {
      id: 1,
      doctor: 'Dr. Ana Costa',
      appointment: 'Consulta de Dermatologia',
      date: '18/01/2024',
      status: 'pending'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova avaliação:', newReview);
    setShowReviewForm(false);
    setNewReview({
      doctor: '',
      appointment: '',
      rating: 5,
      comment: ''
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Minhas Avaliações</h1>
          <p className="text-gray-600 dark:text-dark-300 mt-2">
            Avalie os profissionais que te atenderam e veja suas avaliações
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader 
                title="Minhas Avaliações"
                action={
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Avaliar
                  </Button>
                }
              />
              <CardContent>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-100">Avaliar Profissional</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Profissional</label>
                          <select
                            value={newReview.doctor}
                            onChange={(e) => setNewReview({...newReview, doctor: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          >
                            <option value="">Selecione um profissional</option>
                            <option value="Dr. João Silva">Dr. João Silva</option>
                            <option value="Dr. Maria Santos">Dr. Maria Santos</option>
                            <option value="Dr. Ana Costa">Dr. Ana Costa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Consulta</label>
                          <input
                            type="text"
                            value={newReview.appointment}
                            onChange={(e) => setNewReview({...newReview, appointment: e.target.value})}
                            placeholder="Ex: Consulta de Cardiologia"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Avaliação</label>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewReview({...newReview, rating: i + 1})}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  i < newReview.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-1">Comentário</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          placeholder="Compartilhe sua experiência..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Enviar Avaliação
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">{review.doctor}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                              {review.status === 'published' ? 'Publicada' : 'Pendente'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-dark-300 mb-2">{review.appointment}</p>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-dark-400">{review.rating}/5</span>
                          </div>
                          <p className="text-gray-600 dark:text-dark-300 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 dark:text-dark-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-dark-400">Nenhuma avaliação encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Avaliações Pendentes" />
              <CardContent>
                <div className="space-y-3">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Pendente</span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-dark-100 font-medium">{review.doctor}</p>
                      <p className="text-xs text-gray-600 dark:text-dark-300">{review.appointment}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">{review.date}</p>
                    </div>
                  ))}
                </div>
                {pendingReviews.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-dark-400 text-center">Nenhuma avaliação pendente</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Ações Rápidas" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Ver Avaliações Recebidas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Histórico de Avaliações
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Avaliar Consulta
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

export default PatientReviewsPage;
