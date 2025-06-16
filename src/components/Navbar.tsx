import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, LogOut, User, Calendar, MessageSquare } from 'lucide-react'; // Removed Settings

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-secondary-900">MindCare</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' ? (
                <>
                  <Link to="/admin" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/admin/appointments" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Appointments
                  </Link>
                  <Link to="/admin/clients" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Clients
                  </Link>
                  <Link to="/admin/consultations" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Consultations
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/book-appointment" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </Link>
                  <Link to="/consultation" className="text-secondary-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Consultation</span>
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="text-secondary-700 hover:text-primary-600 p-2 rounded-md">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-secondary-700 hover:text-red-600 p-2 rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
