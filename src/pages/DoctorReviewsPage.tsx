import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Star, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Clock, CheckCircle, TrendingUp, Award, Filter, Search } from 'lucide-react';

const DoctorReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const reviews = [
    {
      id: 1,
      patient: 'Maria Silva',
      appointment: 'Consulta de Cardiologia',
      rating: 5,
      comment: 'Excelente atendimento! Muito atencioso e explicou tudo detalhadamente.',
      date: '15/01/2024',
      status: 'published',
      response: 'Obrigado pelo feedback! Foi um prazer atendê-la.'
    },
    {
      id: 2,
      patient: 'João Santos',
      appointment: 'Exame de Sangue',
      rating: 4,
      comment: 'Profissional muito competente e prestativa.',
      date: '12/01/2024',
      status: 'published',
      response: null
    },
    {
      id: 3,
      patient: 'Ana Costa',
      appointment: 'Consulta de Dermatologia',
      rating: 5,
      comment: 'Atendimento excepcional! Recomendo para todos.',
      date: '10/01/2024',
      status: 'published',
      response: 'Muito obrigado! Sua saúde é nossa prioridade.'
    }
  ];

  const stats = {
    totalReviews: 24,
    averageRating: 4.8,
    fiveStars: 18,
    fourStars: 5,
    threeStars: 1,
    twoStars: 0,
    oneStar: 0
  };

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

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">Avaliações dos Pacientes</h1>
          <p className="text-gray-600 dark:text-dark-300 mt-2">
            Veja o que seus pacientes estão dizendo sobre seu atendimento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader 
                title="Avaliações Recebidas"
                action={
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar avaliações..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                    >
                      <option value="all">Todas as avaliações</option>
                      <option value="5">5 estrelas</option>
                      <option value="4">4 estrelas</option>
                      <option value="3">3 estrelas</option>
                      <option value="2">2 estrelas</option>
                      <option value="1">1 estrela</option>
                    </select>
                  </div>
                }
              />
              <CardContent>
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">{review.patient}</h3>
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
                          {review.response && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Sua resposta:</strong> {review.response}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{review.date}</span>
                            </div>
                            {!review.response && (
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Responder
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Resumo de Avaliações" />
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-1">
                    {stats.averageRating}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars(Math.floor(stats.averageRating))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-dark-400">
                    {stats.totalReviews} avaliações
                  </p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats[`${rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one'}Stars`];
                    const percentage = (count / stats.totalReviews) * 100;
                    return (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-dark-300 w-8">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-dark-400 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Estatísticas" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-300">Avaliação média</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">{stats.averageRating}/5</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-300">Total de avaliações</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">{stats.totalReviews}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-300">5 estrelas</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">{stats.fiveStars}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardHeader title="Ações Rápidas" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Responder Avaliações
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Relatório
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Compartilhar Avaliações
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

export default DoctorReviewsPage;
