import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupplyStore } from '@/stores/supplyStore';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Package,
  Plus,
  AlertTriangle,
  TrendingDown,
  Filter,
  Edit,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Supply } from '@/types';

const SuppliesPage: React.FC = () => {
  const {
    supplies,
    lowStockAlerts,
    isLoading,
    fetchSupplies,
    createSupply,
    updateStock,
    fetchLowStockAlerts,
  } = useSupplyStore();

  const [showForm, setShowForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Supply>>({
    name: '',
    category: '',
    description: '',
    unit: 'unidade',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    isActive: true,
  });
  const [stockForm, setStockForm] = useState({ quantity: 0, reason: '' });

  useEffect(() => {
    fetchSupplies();
    fetchLowStockAlerts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createSupply(formData as Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>);
    if (success) {
      setShowForm(false);
      setFormData({
        name: '',
        category: '',
        description: '',
        unit: 'unidade',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        unitPrice: 0,
        isActive: true,
      });
      fetchSupplies();
      fetchLowStockAlerts();
    }
  };

  const handleStockUpdate = async (supplyId: string) => {
    const success = await updateStock(supplyId, stockForm.quantity, stockForm.reason);
    if (success) {
      setShowStockForm(null);
      setStockForm({ quantity: 0, reason: '' });
      fetchSupplies();
      fetchLowStockAlerts();
    }
  };

  const getStockStatus = (supply: Supply) => {
    if (supply.currentStock === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Esgotado' };
    if (supply.currentStock <= supply.minStock) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Estoque Baixo' };
    if (supply.currentStock >= supply.maxStock) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Estoque Alto' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'Normal' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100">
            Gestão de Insumos Hospitalares
          </h1>
          <p className="text-gray-600 dark:text-dark-400 mt-2">
            Controle de estoque e cadastro de insumos
          </p>
        </div>

        {/* Alertas de Estoque Baixo */}
        {lowStockAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-orange-300 dark:border-orange-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    Alertas de Estoque Baixo
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockAlerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          {alert.supplyName}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Estoque: {alert.currentStock} | Mínimo: {alert.minStock}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {alert.severity === 'critical' ? 'Crítico' : 'Baixo'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Insumo
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
                <h3 className="text-lg font-semibold">Novo Insumo</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Unidade</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                        required
                      >
                        <option value="unidade">Unidade</option>
                        <option value="caixa">Caixa</option>
                        <option value="litro">Litro</option>
                        <option value="kg">Quilograma</option>
                        <option value="metro">Metro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preço Unitário (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estoque Atual</label>
                      <Input
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estoque Mínimo</label>
                      <Input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estoque Máximo</label>
                      <Input
                        type="number"
                        value={formData.maxStock}
                        onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Descrição</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800"
                        rows={3}
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

        {/* Supplies List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Insumos Cadastrados</h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner />
            ) : supplies.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-dark-400 py-8">
                Nenhum insumo cadastrado
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-700">
                      <th className="text-left py-3 px-4 text-sm font-medium">Nome</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Categoria</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Estoque</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplies.map((supply) => {
                      const status = getStockStatus(supply);
                      return (
                        <tr
                          key={supply.id}
                          className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-dark-100">
                            {supply.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-dark-400">
                            {supply.category}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-dark-100">
                            {supply.currentStock} {supply.unit}
                            <div className="text-xs text-gray-500 dark:text-dark-500">
                              Min: {supply.minStock} | Max: {supply.maxStock}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowStockForm(supply.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                            {showStockForm === supply.id && (
                              <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-lg">
                                <div className="space-y-2">
                                  <Input
                                    type="number"
                                    placeholder="Quantidade"
                                    value={stockForm.quantity}
                                    onChange={(e) => setStockForm({ ...stockForm, quantity: parseInt(e.target.value) || 0 })}
                                  />
                                  <Input
                                    placeholder="Motivo"
                                    value={stockForm.reason}
                                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleStockUpdate(supply.id)}
                                      className="bg-primary-600"
                                    >
                                      Salvar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setShowStockForm(null)}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuppliesPage;

