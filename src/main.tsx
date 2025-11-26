import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserRoleProvider } from './contexts/UserRoleContext'
import { useAuthStore } from './stores/authStore'

// Componente para inicializar autenticação
const AuthInitializer = () => {
  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return null;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UserRoleProvider>
        <AuthInitializer />
        <App />
      </UserRoleProvider>
    </ThemeProvider>
  </StrictMode>,
)
