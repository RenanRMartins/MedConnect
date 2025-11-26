import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useExamStore } from '@/stores/examStore';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  FileText,
  Upload,
  Share2,
  Download,
  Calendar,
  User,
  Stethoscope,
} from 'lucide-react';
import { ExamResult } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ExamResultsPage: React.FC = () => {
  const {
    examResults,
    isLoading,
    fetchExamResults,
    createExamResult,
    shareExamResult,
  } = useExamStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ExamResult>>({
    examType: '',
    examDate: new Date().toISOString().split('T')[0],
    resultDate: new Date().toISOString().split('T')[0],
    status: 'completed',
    files: [],
    notes: '',
    isShared: false,
  });

  useEffect(() => {
    fetchExamResults();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createExamResult(formData as Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>);
    if (success) {
      setShowForm(false);
      setFormData({
        examType: '',
        examDate: new Date().toISOString().split('T')[0],
        resultDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        files: [],
        notes: '',
        isShared: false,
      });
      fetchExamResults();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Simular upload - em produção, usar Firebase Storage
    const uploadedFiles = Array.from(files).map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    setFormData({
      ...formData,
      files: [...(formData.files || []), ...uploadedFiles],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">
            Resultados de Exames
          </h1>
          <p className="text-gray-600 dark:text-dark-400 mt-2">
            Gerencie e compartilhe resultados de exames
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Novo Resultado
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Novo Resultado de Exame</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Exame</label>
                      <Input
                        value={formData.examType}
                        onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                        placeholder="Ex: Hemograma, Raio-X, etc"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Data do Exame</label>
                      <Input
                        type="date"
                        value={formData.examDate}
                        onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Data do Resultado</label>
                      <Input
                        type="date"
                        value={formData.resultDate}
                        onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                        required
                      >
                        <option value="pending">Pendente</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Arquivos</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                      />
                      {formData.files && formData.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {formData.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-800 rounded">
                              <span className="text-sm text-gray-700 dark:text-dark-300">{file.name}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    files: formData.files?.filter(f => f.id !== file.id),
                                  });
                                }}
                              >
                                Remover
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Observações</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                      Salvar
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Exam Results List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Resultados de Exames</h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : examResults.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-dark-400 py-8">
                Nenhum resultado de exame encontrado
              </p>
            ) : (
              <div className="space-y-4">
                {examResults.map((exam) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-primary-600" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                            {exam.examType}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-dark-400 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Exame: {format(new Date(exam.examDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Resultado: {format(new Date(exam.resultDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              exam.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : exam.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {exam.status === 'completed' ? 'Concluído' : exam.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              exam.isShared
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {exam.isShared ? 'Compartilhado' : 'Privado'}
                            </span>
                          </div>
                        </div>
                        {exam.notes && (
                          <p className="text-sm text-gray-700 dark:text-dark-300 mb-3">
                            {exam.notes}
                          </p>
                        )}
                        {exam.files && exam.files.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exam.files.map((file) => (
                              <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-dark-800 rounded text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700"
                              >
                                <Download className="w-4 h-4" />
                                {file.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareExamResult(exam.id, !exam.isShared)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {exam.isShared ? 'Descompartilhar' : 'Compartilhar'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamResultsPage;

