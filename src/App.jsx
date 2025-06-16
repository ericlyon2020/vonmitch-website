/*
Vonmitch Mental Wellness - React App with Supabase Integration
Theme: Light Green & Lavender
*/

import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import './App.css';

const supabase = createClient(
  'https://ejeonrlalhdechwibuuu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZW9ucmxhbGhkZWNod2lidXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDMxNjksImV4cCI6MjA2NTY3OTE2OX0.izK9VbSbkoEFYjFuHnsYkY8gpOKFaA9cSd4AIgC4EFg'
);

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('appointments').insert([
      { name, email, date }
    ]);

    if (!error) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setDate('');
    } else {
      alert('Error booking appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-lavender text-green-900 p-4">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold">Vonmitch Mental Wellness</h1>
        <p className="text-lg">With Sheila Kekayaya</p>
      </header>

      <section className="max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
        {submitted ? (
          <p className="text-green-700">Thank you! Your booking has been received.</p>
        ) : (
          <form className="grid gap-4" onSubmit={handleBooking}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Book Appointment
            </button>
          </form>
        )}
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Contact Sheila</h2>
        <div className="flex flex-col gap-2 items-center">
          <a
            href="https://wa.me/254712345678"
            className="text-green-700 underline"
            target="_blank"
          >
            WhatsApp
          </a>
          <a href="tel:+254712345678" className="text-green-700 underline">
            Call Now
          </a>
          <a href="mailto:sheila@example.com" className="text-green-700 underline">
            Email
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
