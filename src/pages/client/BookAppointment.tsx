import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const appointmentSchema = z.object({
  appointmentDate: z.string().min(1, 'Please select a date'),
  appointmentTime: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
];

export const BookAppointment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          client_id: profile.id,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          notes: data.notes,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Appointment booked successfully!');
      reset();
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Book Appointment</h1>
          <p className="text-secondary-600 mt-2">
            Schedule a session with your mental health professional
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-secondary-700 mb-2">
                Preferred Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  {...register('appointmentDate')}
                  type="date"
                  min={today}
                  className="input-field pl-10"
                />
              </div>
              {errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="appointmentTime" className="block text-sm font-medium text-secondary-700 mb-2">
                Preferred Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <select
                  {...register('appointmentTime')}
                  className="input-field pl-10"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {errors.appointmentTime && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-field"
                placeholder="Any specific concerns or topics you'd like to discuss..."
              />
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-2">Important Information:</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Appointments are subject to availability and confirmation</li>
                <li>• You will receive a confirmation email once your appointment is approved</li>
                <li>• Please arrive 10 minutes early for your appointment</li>
                <li>• Cancellations must be made at least 24 hours in advance</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
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