import React from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserRoleContext } from '@/contexts/UserRoleContext';
import { UserRole } from '@/hooks/useUserRole';
import { Sun, Moon, User, Stethoscope, Settings } from 'lucide-react';

const HeaderControls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRole, setSelectedRole } = useUserRoleContext();

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
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </button>

      {/* Perfil do Usuário */}
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
            userButtonPopoverActionButton: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-300",
            userButtonPopoverFooter: "hidden",
          }
        }}
      />
    </div>
  );
};

export default HeaderControls;
