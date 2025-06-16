import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
}

interface ConsultationRequest {
  id: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
}

export const ClientDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!profile) return;

    try {
      // Fetch recent appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', profile.id)
        .order('appointment_date', { ascending: true })
        .limit(5);

      // Fetch recent consultation requests
      const { data: consultationsData } = await supabase
        .from('consultation_requests')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setAppointments(appointmentsData || []);
      setConsultations(consultationsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
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
            Welcome back, {profile?.full_name}
          </h1>
          <p className="text-secondary-600 mt-2">
            Here's an overview of your mental wellness journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/book-appointment" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Book Appointment</h3>
                <p className="text-secondary-600">Schedule a session with your doctor</p>
              </div>
            </div>
          </Link>

          <Link to="/consultation" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Request Consultation</h3>
                <p className="text-secondary-600">Get professional advice and support</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Appointments</h2>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(appointment.status)}
                      <div>
                        <p className="font-medium text-secondary-900">
                          {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600 text-center py-8">
                No appointments yet. <Link to="/book-appointment" className="text-primary-600 hover:underline">Book your first appointment</Link>
              </p>
            )}
          </div>

          {/* Recent Consultation Requests */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Consultations</h2>
            {consultations.length > 0 ? (
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-secondary-900">{consultation.subject}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
                        {consultation.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-secondary-600">
                        {format(new Date(consultation.created_at), 'MMM dd, yyyy')}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        consultation.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600 text-center py-8">
                No consultation requests yet. <Link to="/consultation" className="text-primary-600 hover:underline">Request your first consultation</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};