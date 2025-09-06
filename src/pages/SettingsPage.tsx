import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Settings, Bell, Shield, Eye, Lock, Trash2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas preferências e configurações
          </p>
        </motion.div>

        <div className="space-y-6">
          <Card>
            <CardHeader 
              title="Notificações" 
              icon={<Bell className="w-5 h-5" />}
            />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">E-mail</h3>
                    <p className="text-sm text-gray-500">Receber notificações por e-mail</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">SMS</h3>
                    <p className="text-sm text-gray-500">Receber notificações por SMS</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Push</h3>
                    <p className="text-sm text-gray-500">Receber notificações push</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
              title="Privacidade" 
              icon={<Shield className="w-5 h-5" />}
            />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Perfil Público</h3>
                    <p className="text-sm text-gray-500">Tornar perfil visível para outros usuários</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Histórico Compartilhado</h3>
                    <p className="text-sm text-gray-500">Compartilhar histórico com profissionais</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
              title="Segurança" 
              icon={<Lock className="w-5 h-5" />}
            />
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" fullWidth className="justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Alterar Senha
                </Button>
                <Button variant="outline" fullWidth className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Autenticação de Dois Fatores
                </Button>
                <Button variant="outline" fullWidth className="justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
