import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white/70 border-t border-navy-light/20 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Clinic Info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-teal font-extrabold text-2xl tracking-tight">Clinic</span>
            <span className="text-white font-medium text-2xl tracking-tight">Flow</span>
          </Link>
          <p className="text-sm leading-relaxed text-white/50">
            Premium dermatological care in Karachi. Providing advanced medical and aesthetic treatments tailored to your unique skin health.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#hero" className="hover:text-teal transition-colors">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-teal transition-colors">About Dr. Ali Ahmed</a>
            </li>
            <li>
              <a href="#services" className="hover:text-teal transition-colors">Our Services</a>
            </li>
            <li>
              <Link to="/book" className="hover:text-teal transition-colors">Book Appointment</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Contact Us</h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start space-x-2.5">
              <MapPin size={16} className="text-teal mt-0.5 shrink-0" />
              <span>Suite 402, Clifton Medical Complex, Karachi</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone size={16} className="text-teal shrink-0" />
              <span>+92 21 35876543</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail size={16} className="text-teal shrink-0" />
              <span>info@clinicflow.com</span>
            </li>
          </ul>
        </div>

        {/* Timings summary */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide">Working Hours</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li className="flex justify-between">
              <span>Mon - Thu:</span>
              <span className="text-white">9:00 AM - 5:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Friday:</span>
              <span className="text-white">9:00 AM - 1:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday:</span>
              <span className="text-white">10:00 AM - 2:00 PM</span>
            </li>
            <li className="flex justify-between text-red-400">
              <span>Sunday:</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-navy-light/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 space-y-4 md:space-y-0">
        <div>
          © 2026 ClinicFlow & Dr. Ali Ahmed. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <Link to="/login" className="hover:text-teal transition-colors">Admin Login</Link>
          <a href="#" className="hover:text-teal transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
