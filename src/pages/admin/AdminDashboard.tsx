import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MessageSquare, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';

interface DashboardStats {
  totalClients: number;
  pendingAppointments: number;
  pendingConsultations: number;
  todayAppointments: number;
}

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingAppointments: 0,
    pendingConsultations: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total clients
      const { count: clientsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      // Get pending appointments
      const { count: pendingAppointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get pending consultations
      const { count: pendingConsultationsCount } = await supabase
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: todayAppointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', today)
        .in('status', ['confirmed', 'pending']);

      setStats({
        totalClients: clientsCount || 0,
        pendingAppointments: pendingAppointmentsCount || 0,
        pendingConsultations: pendingConsultationsCount || 0,
        todayAppointments: todayAppointmentsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome, Dr. {profile?.full_name}
          </h1>
          <p className="text-secondary-600 mt-2">
            Here's an overview of your practice today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalClients}</p>
                <p className="text-secondary-600">Total Clients</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.pendingAppointments}</p>
                <p className="text-secondary-600">Pending Appointments</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <MessageSquare className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.pendingConsultations}</p>
                <p className="text-secondary-600">Pending Consultations</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stats.todayAppointments}</p>
                <p className="text-secondary-600">Today's Appointments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/appointments" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Manage Appointments</h3>
                <p className="text-secondary-600">Review and confirm appointments</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/consultations" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Consultation Requests</h3>
                <p className="text-secondary-600">Respond to client consultations</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/clients" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Client Management</h3>
                <p className="text-secondary-600">View and manage client profiles</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Priority Alerts */}
        {(stats.pendingConsultations > 0 || stats.pendingAppointments > 0) && (
          <div className="card bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">Priority Actions</h2>
            <div className="space-y-3">
              {stats.pendingConsultations > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-red-500" />
                    <span className="text-secondary-900">
                      {stats.pendingConsultations} consultation request{stats.pendingConsultations > 1 ? 's' : ''} awaiting response
                    </span>
                  </div>
                  <Link to="/admin/consultations" className="btn-primary text-sm">
                    Review
                  </Link>
                </div>
              )}
              {stats.pendingAppointments > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-secondary-900">
                      {stats.pendingAppointments} appointment{stats.pendingAppointments > 1 ? 's' : ''} awaiting confirmation
                    </span>
                  </div>
                  <Link to="/admin/appointments" className="btn-primary text-sm">
                    Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};