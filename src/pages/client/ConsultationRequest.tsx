import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const consultationSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const priorityOptions = [
  { value: 'low', label: 'Low - General question or concern', color: 'text-green-600' },
  { value: 'medium', label: 'Medium - Moderate concern', color: 'text-yellow-600' },
  { value: 'high', label: 'High - Significant concern', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent - Immediate attention needed', color: 'text-red-600' },
];

export const ConsultationRequest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const selectedPriority = watch('priority');

  const onSubmit = async (data: ConsultationFormData) => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .insert({
          client_id: profile.id,
          subject: data.subject,
          message: data.message,
          priority: data.priority,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Consultation request submitted successfully!');
      reset();
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Request Consultation</h1>
          <p className="text-secondary-600 mt-2">
            Reach out to your mental health professional for guidance and support
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                Subject *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  {...register('subject')}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Brief description of your concern"
                />
              </div>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-secondary-700 mb-2">
                Priority Level *
              </label>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 cursor-pointer">
                    <input
                      {...register('priority')}
                      type="radio"
                      value={option.value}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center space-x-2">
                      {option.value === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className={`font-medium ${option.color}`}>
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                Detailed Message *
              </label>
              <textarea
                {...register('message')}
                rows={6}
                className="input-field"
                placeholder="Please describe your concern in detail. Include any relevant symptoms, situations, or questions you have..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {selectedPriority === 'urgent' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Urgent Priority Selected</h3>
                    <p className="text-sm text-red-800 mt-1">
                      If you are experiencing a mental health emergency or having thoughts of self-harm, 
                      please contact emergency services immediately or call the National Suicide Prevention Lifeline at 988.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-2">What to Expect:</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Your request will be reviewed by a mental health professional</li>
                <li>• Response time varies based on priority level</li>
                <li>• You will receive a notification when a response is available</li>
                <li>• All communications are confidential and secure</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};