import React, { useEffect, useState } from 'react';
import { MessageSquare, User, Clock, AlertTriangle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ConsultationRequest {
  id: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved';
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export const ConsultationRequests: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select(`
          *,
          profiles:client_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Error loading consultation requests');
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId: string, status: string, adminResponse?: string) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminResponse) {
        updateData.admin_response = adminResponse;
      }

      const { error } = await supabase
        .from('consultation_requests')
        .update(updateData)
        .eq('id', consultationId);

      if (error) throw error;

      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId
            ? { ...consultation, status: status as any, admin_response: adminResponse || consultation.admin_response }
            : consultation
        )
      );

      if (selectedConsultation?.id === consultationId) {
        setSelectedConsultation(prev => prev ? {
          ...prev,
          status: status as any,
          admin_response: adminResponse || prev.admin_response
        } : null);
      }

      toast.success('Consultation updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRespond = async () => {
    if (!selectedConsultation || !response.trim()) return;

    setResponding(true);
    try {
      await updateConsultationStatus(selectedConsultation.id, 'resolved', response);
      setResponse('');
    } catch (error) {
      // Error handled in updateConsultationStatus
    } finally {
      setResponding(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Consultation Requests</h1>
          <p className="text-secondary-600 mt-2">
            Review and respond to client consultation requests
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Consultations List */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                All Requests ({consultations.length})
              </h2>
              
              {consultations.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      onClick={() => setSelectedConsultation(consultation)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedConsultation?.id === consultation.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-secondary-900 truncate">
                            {consultation.subject}
                          </h3>
                          {consultation.priority === 'urgent' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(consultation.priority)}`}>
                          {consultation.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-secondary-600">
                          <User className="h-4 w-4" />
                          <span>{consultation.profiles.full_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(consultation.status)}`}>
                            {consultation.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-secondary-500">
                            {format(new Date(consultation.created_at), 'MMM dd')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No consultation requests
                  </h3>
                  <p className="text-secondary-600">
                    No consultation requests have been submitted yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Consultation Details */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Request Details
              </h2>
              
              {selectedConsultation ? (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-secondary-200">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {selectedConsultation.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedConsultation.priority)}`}>
                        {selectedConsultation.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{selectedConsultation.profiles.full_name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(selectedConsultation.created_at), 'MMM dd, yyyy HH:mm')}</span>
                      </span>
                    </div>

                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedConsultation.status)}`}>
                      {selectedConsultation.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Client Message:</h4>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <p className="text-secondary-800 leading-relaxed">
                        {selectedConsultation.message}
                      </p>
                    </div>
                  </div>

                  {selectedConsultation.admin_response && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Your Response:</h4>
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-primary-800 leading-relaxed">
                          {selectedConsultation.admin_response}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedConsultation.status !== 'resolved' && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Your Response:</h4>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={4}
                        className="input-field mb-3"
                        placeholder="Type your response to the client..."
                      />
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleRespond}
                          disabled={!response.trim() || responding}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>{responding ? 'Sending...' : 'Send Response'}</span>
                        </button>
                        
                        {selectedConsultation.status === 'pending' && (
                          <button
                            onClick={() => updateConsultationStatus(selectedConsultation.id, 'in_progress')}
                            className="btn-secondary"
                          >
                            Mark In Progress
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    Select a consultation request to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};