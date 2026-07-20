import React from 'react';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';

const Book = () => {
  return (
    <div className="min-h-screen bg-graybg flex flex-col justify-between">
      <div>
        {/* Navigation */}
        <Header />

        {/* Page Header (Matching navy/gold luxury theme) */}
        <div className="bg-navy pt-28 pb-14 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-teal font-semibold text-xs uppercase tracking-widest">Appointment Scheduler</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
              Book Your Consultation
            </h1>
            <p className="text-white/50 font-light text-sm mt-2 max-w-lg mx-auto">
              Secure your session in 3 simple steps. Dr. Ali Ahmed will review your time slot and notify you on WhatsApp.
            </p>
          </div>
        </div>

        {/* Booking Wizard Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <BookingForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Book;
