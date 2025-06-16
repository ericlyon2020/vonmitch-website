import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Clock, Users, Calendar, MessageCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-secondary-900">MindCare</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Your Mental Wellness Journey Starts Here
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Connect with professional mental health support through our secure platform. 
            Book appointments, seek consultations, and take control of your mental wellness.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Your Journey
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Client Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-lg text-secondary-600">
              Everything you need for your mental wellness journey in one secure platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Easy Appointment Booking
              </h3>
              <p className="text-secondary-600">
                Schedule appointments with available time slots that work for your schedule
              </p>
            </div>

            <div className="card text-center">
              <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Secure Consultations
              </h3>
              <p className="text-secondary-600">
                Request consultations and communicate securely with mental health professionals
              </p>
            </div>

            <div className="card text-center">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Privacy & Security
              </h3>
              <p className="text-secondary-600">
                Your information is protected with enterprise-grade security and privacy measures
              </p>
            </div>

            <div className="card text-center">
              <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                24/7 Access
              </h3>
              <p className="text-secondary-600">
                Access your portal anytime to manage appointments and track your progress
              </p>
            </div>

            <div className="card text-center">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Professional Care
              </h3>
              <p className="text-secondary-600">
                Connect with licensed mental health professionals dedicated to your wellbeing
              </p>
            </div>

            <div className="card text-center">
              <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Personalized Support
              </h3>
              <p className="text-secondary-600">
                Receive personalized care tailored to your unique mental health needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands who have started their mental wellness journey with MindCare
          </p>
          <Link to="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Heart className="h-8 w-8 text-primary-400" />
            <span className="text-2xl font-bold">MindCare</span>
          </div>
          <div className="text-center text-secondary-400">
            <p>&copy; 2025 MindCare. All rights reserved.</p>
            <p className="mt-2">Professional mental health support platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};