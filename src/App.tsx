import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// Pages
import LandingPage from '@/pages/LandingPage';
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

// Components
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
                      <SignedIn>
                        <Dashboard />
                      </SignedIn>
                    }
                  />
                  <Route
                    path="/patient-dashboard"
                    element={
                      <SignedIn>
                        <PatientDashboard />
                      </SignedIn>
                    }
                  />
                  <Route
                    path="/doctor-dashboard"
                    element={
                      <SignedIn>
                        <DoctorDashboard />
                      </SignedIn>
                    }
                  />
            
            <Route
              path="/appointments"
              element={
                <SignedIn>
                  <AppointmentsPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/appointments/new"
              element={
                <SignedIn>
                  <NewAppointmentPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/appointments/:id"
              element={
                <SignedIn>
                  <div>Appointment Details</div>
                </SignedIn>
              }
            />
            
            <Route
              path="/medical-history"
              element={
                <SignedIn>
                  <MedicalHistoryPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/patient-medical-history"
              element={
                <SignedIn>
                  <PatientMedicalHistoryPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/doctor-medical-history"
              element={
                <SignedIn>
                  <DoctorMedicalHistoryPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/reviews"
              element={
                <SignedIn>
                  <ReviewsPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/patient-reviews"
              element={
                <SignedIn>
                  <PatientReviewsPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/doctor-reviews"
              element={
                <SignedIn>
                  <DoctorReviewsPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/support"
              element={
                <SignedIn>
                  <SupportPage />
                </SignedIn>
              }
            />
            
            <Route
              path="/profile"
              element={
                <SignedIn>
                  <ProfilePage />
                </SignedIn>
              }
            />
            
            <Route
              path="/settings"
              element={
                <SignedIn>
                  <SettingsPage />
                </SignedIn>
              }
            />
            <Route
              path="/patients"
              element={
                <SignedIn>
                  <PatientsPage />
                </SignedIn>
              }
            />
            <Route
              path="/reports"
              element={
                <SignedIn>
                  <ReportsPage />
                </SignedIn>
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
