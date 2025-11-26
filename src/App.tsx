import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import PatientDashboard from '@/pages/PatientDashboard';
import DoctorDashboard from '@/pages/DoctorDashboard';
import AppointmentsPage from '@/pages/AppointmentsPage';
import NewAppointmentPage from '@/pages/NewAppointmentPage';
import MedicalHistoryPage from '@/pages/MedicalHistoryPage';
import PatientMedicalHistoryPage from '@/pages/PatientMedicalHistoryPage';
import DoctorMedicalHistoryPage from '@/pages/DoctorMedicalHistoryPage';
import ReviewsPage from '@/pages/ReviewsPage';
import PatientReviewsPage from '@/pages/PatientReviewsPage';
import DoctorReviewsPage from '@/pages/DoctorReviewsPage';
import SupportPage from '@/pages/SupportPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import PatientsPage from '@/pages/PatientsPage';
import ReportsPage from '@/pages/ReportsPage';
import FinancialManagementPage from '@/pages/FinancialManagementPage';
import SuppliesPage from '@/pages/SuppliesPage';
import ExamResultsPage from '@/pages/ExamResultsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

// Components
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={<LandingPage />} 
            />
            
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
            
            <Route 
              path="/register" 
              element={<RegisterPage />} 
            />
            
            <Route 
              path="/terms" 
              element={<div>Terms of Service</div>} 
            />
            <Route 
              path="/privacy" 
              element={<div>Privacy Policy</div>} 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <NewAppointmentPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <div>Appointment Details</div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/medical-history"
              element={
                <ProtectedRoute>
                  <MedicalHistoryPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/patient-medical-history"
              element={
                <ProtectedRoute>
                  <PatientMedicalHistoryPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/doctor-medical-history"
              element={
                <ProtectedRoute>
                  <DoctorMedicalHistoryPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <ReviewsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/patient-reviews"
              element={
                <ProtectedRoute>
                  <PatientReviewsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/doctor-reviews"
              element={
                <ProtectedRoute>
                  <DoctorReviewsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <SupportPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/financial"
              element={
                <ProtectedRoute>
                  <FinancialManagementPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/supplies"
              element={
                <ProtectedRoute>
                  <SuppliesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/exam-results"
              element={
                <ProtectedRoute>
                  <ExamResultsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
