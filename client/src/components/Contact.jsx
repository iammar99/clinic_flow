import React from 'react';
import { MapPin, Phone, MessageSquare, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-graybg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-up">
          <span className="text-teal font-semibold text-sm uppercase tracking-wider block mb-2">Location & Timing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
            Contact ClinicFlow
          </h2>
          <p className="text-navy/60 font-light text-base mt-3">
            Get in touch or visit us at Clifton, Karachi.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Info & Hours */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 animate-fade-up">
            
            {/* Contact details */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-navy tracking-wide">
                Get In Touch
              </h3>

              <div className="space-y-4">
                <a 
                  href="https://maps.google.com/?q=Clifton+Karachi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3.5 p-4 bg-white hover:border-teal/30 border border-transparent rounded-lg transition-all shadow-premium"
                >
                  <MapPin size={20} className="text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-navy/40 uppercase">Clinic Address</span>
                    <span className="text-sm font-semibold text-navy mt-0.5 block">Suite 402, Clifton Medical Complex, Block 5, Clifton, Karachi</span>
                  </div>
                </a>

                <a 
                  href="tel:+922135876543" 
                  className="flex items-center space-x-3.5 p-4 bg-white hover:border-teal/30 border border-transparent rounded-lg transition-all shadow-premium"
                >
                  <Phone size={20} className="text-teal shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-navy/40 uppercase">Call to Clinic</span>
                    <span className="text-sm font-semibold text-navy mt-0.5 block">+92 21 35876543</span>
                  </div>
                </a>

                <a 
                  href="https://wa.me/923001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3.5 p-4 bg-white hover:border-teal/30 border border-transparent rounded-lg transition-all shadow-premium"
                >
                  <MessageSquare size={20} className="text-emerald-500 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-navy/40 uppercase">WhatsApp Chat</span>
                    <span className="text-sm font-semibold text-navy mt-0.5 block">+92 300 1234567</span>
                  </div>
                </a>

                <a 
                  href="mailto:appointments@clinicflow.com" 
                  className="flex items-center space-x-3.5 p-4 bg-white hover:border-teal/30 border border-transparent rounded-lg transition-all shadow-premium"
                >
                  <Mail size={20} className="text-teal shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-navy/40 uppercase">Email Address</span>
                    <span className="text-sm font-semibold text-navy mt-0.5 block">appointments@clinicflow.com</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Timings details */}
            <div className="p-6 bg-navy text-white rounded-xl shadow-premium space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2 text-white">
                <Clock size={18} className="text-teal" />
                <span>Consultation Timings</span>
              </h3>
              <div className="space-y-2.5 text-sm pt-2">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Monday - Thursday</span>
                  <span className="font-semibold text-teal">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Friday</span>
                  <span className="font-semibold text-teal">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Saturday</span>
                  <span className="font-semibold text-teal">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 h-96 lg:h-auto min-h-[400px] rounded-xl overflow-hidden border border-navy/5 shadow-premium bg-white animate-fade-up">
            <iframe 
              title="ClinicFlow Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m4!2m3!1d3620.5901614749454!2d67.0315486!3d-24.8213601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dc000000001%3A0x7d8a6e812d1bdf69!2sClifton%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
