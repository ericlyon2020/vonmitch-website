import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { BookAppointment } from './pages/client/BookAppointment';
import { ConsultationRequest } from './pages/client/ConsultationRequest';
import { ClientProfile } from './pages/client/ClientProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageAppointments } from './pages/admin/ManageAppointments';
import { ManageClients } from './pages/admin/ManageClients';
import { ConsultationRequests } from './pages/admin/ConsultationRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Client Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/book-appointment" element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="/consultation" element={
              <ProtectedRoute>
                <ConsultationRequest />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ClientProfile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/appointments" element={
              <AdminRoute>
                <ManageAppointments />
              </AdminRoute>
            } />
            <Route path="/admin/clients" element={
              <AdminRoute>
                <ManageClients />
              </AdminRoute>
            } />
            <Route path="/admin/consultations" element={
              <AdminRoute>
                <ConsultationRequests />
              </AdminRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
