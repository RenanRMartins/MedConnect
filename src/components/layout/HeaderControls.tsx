import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserRoleContext } from '@/contexts/UserRoleContext';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/hooks/useUserRole';
import { Sun, Moon, User, Stethoscope, Settings, LogOut } from 'lucide-react';
import NotificationButton from './NotificationButton';

const HeaderControls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRole, setSelectedRole } = useUserRoleContext();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const roleOptions: { value: UserRole; label: string; icon: React.ElementType }[] = [
    { value: 'patient', label: 'Paciente', icon: User },
    { value: 'doctor', label: 'Médico', icon: Stethoscope },
  ];

  return (
    <div className="flex items-center space-x-4">
      {/* Seletor de Tipo de Usuário */}
      <div className="relative">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          className="appearance-none bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
        >
          {roleOptions.map((option) => {
            const Icon = option.icon;
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Toggle do Modo Escuro */}
      <button
        onClick={toggleTheme}
        className="relative p-2 text-gray-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
        title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'light' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </button>

      {/* Notificações */}
      <NotificationButton />

      {/* Perfil do Usuário */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-700">
              <p className="text-sm font-medium text-gray-900 dark:text-dark-100">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-400 truncate">
                {user?.email}
              </p>
            </div>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700"
              onClick={() => setShowMenu(false)}
            >
              <User className="w-4 h-4 inline mr-2" />
              Perfil
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-700"
              onClick={() => setShowMenu(false)}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configurações
            </Link>
            <button
              onClick={async (e) => {
                e.preventDefault();
                setShowMenu(false);
                // Aguardar um pouco para o menu fechar
                await new Promise(resolve => setTimeout(resolve, 100));
                await logout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              <LogOut className="w-4 h-4 inline mr-2" />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderControls;
