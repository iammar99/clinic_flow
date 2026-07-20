import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Users, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen bg-gradient-to-br from-navy to-navy-light text-white flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Visual Accents (No busy patterns, just smooth premium glows) */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Trusted Badge */}
          <div className="inline-flex items-center space-x-2 bg-navy-light/60 border border-gold/30 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-wider">
            <span>⭐</span>
            <span>Trusted Dermatologist in Karachi</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Your Skin Health,<br />
            <span className="text-teal">Our Priority</span>
          </h1>

          {/* Subheading */}
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl text-white/90 font-medium">
              Dr. Ali Ahmed
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light max-w-xl">
              12+ Years of Excellence in Clinical and Cosmetic Dermatology. Offering personalized treatment plans for healthy, glowing skin.
            </p>
          </div>

          {/* Key Stats Strip */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10 max-w-xl">
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-teal">12+ Yrs</span>
              <span className="block text-xs text-white/40 uppercase tracking-wider font-semibold">Experience</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-gold">5k+</span>
              <span className="block text-xs text-white/40 uppercase tracking-wider font-semibold">Happy Patients</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-teal">98%</span>
              <span className="block text-xs text-white/40 uppercase tracking-wider font-semibold">Satisfaction</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/book" 
              className="bg-teal hover:bg-teal-dark text-navy font-bold px-8 py-4 rounded-lg text-base transition-all duration-300 shadow-glow flex items-center space-x-2"
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
            </Link>
            <button 
              onClick={handleScrollToServices}
              className="border border-white/30 hover:border-white text-white font-medium px-8 py-4 rounded-lg text-base transition-colors"
            >
              View Services
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-4 text-white/40 text-xs font-semibold tracking-wide">
            <span className="flex items-center space-x-1.5">
              <CheckCircle size={14} className="text-teal" />
              <span>ISO 9001 CERTIFIED</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle size={14} className="text-teal" />
              <span>MEMBER OF PAD</span>
            </span>
          </div>

        </motion.div>

        {/* Right Side: Doctor Avatar Mockup (Premium Vector Graphics instead of basic placeholder) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center relative"
        >
          {/* Ring Glow Container */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border border-teal/30 flex items-center justify-center p-3">
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping pointer-events-none opacity-40" />

            {/* Inner avatar holder */}
            <div className="w-full h-full rounded-full bg-navy-light overflow-hidden border-2 border-teal flex items-center justify-center relative bg-gradient-to-t from-navy-dark to-navy-light shadow-premium">
              {/* Sleek SVG Dermatologist Silhouette/Illustration */}
              <svg 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4/5 h-4/5 text-white/80 mt-12"
              >
                {/* Doctor Body */}
                <path 
                  d="M100 115C135 115 168 135 174 165C175 169 172 172 168 172H32C28 172 25 169 26 165C32 135 65 115 100 115Z" 
                  fill="currentColor" 
                  opacity="0.95"
                />
                {/* Stethoscope */}
                <path 
                  d="M72 130C72 155 128 155 128 130" 
                  stroke="#00D4AA" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                />
                <circle cx="100" cy="155" r="8" fill="#FFB800" />
                {/* Head */}
                <circle cx="100" cy="70" r="32" fill="currentColor" />
                {/* Doctor Collar */}
                <path 
                  d="M85 115L100 135L115 115" 
                  stroke="#FFB800" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>

              {/* Float badge */}
              <div className="absolute bottom-6 bg-navy-dark/95 border border-teal/50 px-4 py-2 rounded-lg shadow-glow flex items-center space-x-2">
                <Award size={16} className="text-teal" />
                <span className="text-xs font-semibold text-white tracking-wide">Dr. Ali Ahmed</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
