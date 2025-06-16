import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';
import { format } from 'date-fns';

interface Client {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  emergency_contact: string | null;
  medical_history: string | null;
  created_at: string;
}

export const ManageClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Client Management</h1>
          <p className="text-secondary-600 mt-2">
            View and manage client profiles and information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Clients List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                All Clients ({clients.length})
              </h2>
              
              {clients.length > 0 ? (
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedClient?.id === client.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 p-2 rounded-lg">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-secondary-900">
                              {client.full_name}
                            </h3>
                            <p className="text-sm text-secondary-600">{client.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">
                            Joined {format(new Date(client.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No clients found
                  </h3>
                  <p className="text-secondary-600">
                    No clients have registered yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Client Details
              </h2>
              
              {selectedClient ? (
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-secondary-200">
                    <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {selectedClient.full_name}
                    </h3>
                    <p className="text-secondary-600">{selectedClient.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-secondary-400" />
                      <div>
                        <p className="text-sm font-medium text-secondary-700">Email</p>
                        <p className="text-secondary-900">{selectedClient.email}</p>
                      </div>
                    </div>

                    {selectedClient.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Phone</p>
                          <p className="text-secondary-900">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}

                    {selectedClient.date_of_birth && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Date of Birth</p>
                          <p className="text-secondary-900">
                            {format(new Date(selectedClient.date_of_birth), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedClient.emergency_contact && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Emergency Contact</p>
                          <p className="text-secondary-900">{selectedClient.emergency_contact}</p>
                        </div>
                      </div>
                    )}

                    {selectedClient.medical_history && (
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-secondary-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Medical History</p>
                          <p className="text-secondary-900 text-sm leading-relaxed">
                            {selectedClient.medical_history}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-secondary-200">
                      <p className="text-sm text-secondary-600">
                        <strong>Member since:</strong> {format(new Date(selectedClient.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">
                    Select a client to view their details
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