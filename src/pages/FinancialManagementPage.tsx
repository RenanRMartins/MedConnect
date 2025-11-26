import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinancialStore } from '@/stores/financialStore';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import { exportData } from '@/utils/exportUtils';
import { FinancialTransaction } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FinancialManagementPage: React.FC = () => {
  const {
    transactions,
    dashboard,
    isLoading,
    fetchTransactions,
    createTransaction,
    fetchDashboard,
    filters,
    setFilters,
  } = useFinancialStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<FinancialTransaction>>({
    type: 'revenue',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    status: 'completed',
  });

  useEffect(() => {
    fetchTransactions();
    fetchDashboard();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createTransaction(formData as Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>);
    if (success) {
      setShowForm(false);
      setFormData({
        type: 'revenue',
        category: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        status: 'completed',
      });
      fetchTransactions();
      fetchDashboard();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const revenueCategories = ['Consulta', 'Exame', 'Procedimento', 'Outros'];
  const expenseCategories = ['Salário', 'Aluguel', 'Insumos', 'Equipamentos', 'Outros'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">
            Gestão Financeira
          </h1>
          <p className="text-gray-600 dark:text-dark-400 mt-2">
            Gerencie receitas, despesas e acompanhe a lucratividade
          </p>
        </div>

        {isLoading && !dashboard ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* Dashboard Cards */}
            {dashboard && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Receita Total</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(dashboard.totalRevenue)}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Despesas Total</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(dashboard.totalExpenses)}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Lucro</p>
                        <p className={`text-2xl font-bold ${
                          dashboard.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(dashboard.profit)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Margem de Lucro</p>
                        <p className={`text-2xl font-bold ${
                          dashboard.profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {dashboard.profitMargin.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Transação
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    exportData(transactions, {
                      format: 'excel',
                      reportType: 'financial',
                    });
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>

              <div className="flex gap-2">
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any || undefined })}
                  className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
                >
                  <option value="">Todos os tipos</option>
                  <option value="revenue">Receitas</option>
                  <option value="expense">Despesas</option>
                </select>
              </div>
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
                    <h3 className="text-lg font-semibold">
                      {formData.type === 'revenue' ? 'Nova Receita' : 'Nova Despesa'}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tipo</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                            required
                          >
                            <option value="revenue">Receita</option>
                            <option value="expense">Despesa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Categoria</label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                            required
                          >
                            <option value="">Selecione...</option>
                            {(formData.type === 'revenue' ? revenueCategories : expenseCategories).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Descrição</label>
                          <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Data</label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
                          <select
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                            required
                          >
                            <option value="cash">Dinheiro</option>
                            <option value="card">Cartão</option>
                            <option value="transfer">Transferência</option>
                            <option value="pix">PIX</option>
                          </select>
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

            {/* Transactions List */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Transações</h3>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingSpinner />
                ) : transactions.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-dark-400 py-8">
                    Nenhuma transação encontrada
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-dark-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Data</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Tipo</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Categoria</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Descrição</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Valor</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-dark-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-dark-100">
                              {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.type === 'revenue'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {transaction.type === 'revenue' ? 'Receita' : 'Despesa'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-dark-100">
                              {transaction.category}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-dark-100">
                              {transaction.description}
                            </td>
                            <td className={`py-3 px-4 text-sm text-right font-medium ${
                              transaction.type === 'revenue'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'revenue' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {transaction.status === 'completed' ? 'Concluído' : transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialManagementPage;

