import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react';

const ProfilePage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader 
                title="Informações Pessoais" 
                action={
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                }
              />
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome completo"
                      value="João Silva"
                      leftIcon={<User className="w-4 h-4" />}
                      disabled
                    />
                    <Input
                      label="E-mail"
                      value="joao@email.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      disabled
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Telefone"
                      value="(11) 99999-9999"
                      leftIcon={<Phone className="w-4 h-4" />}
                      disabled
                    />
                    <Input
                      label="Data de nascimento"
                      value="01/01/1990"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      disabled
                    />
                  </div>

                  <Input
                    label="Endereço"
                    value="Rua das Flores, 123 - São Paulo, SP"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Foto do Perfil" />
              <CardContent>
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Ações" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" fullWidth className="justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="outline" fullWidth className="justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Alterar E-mail
                  </Button>
                  <Button variant="outline" fullWidth className="justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Alterar Telefone
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

export default ProfilePage;
