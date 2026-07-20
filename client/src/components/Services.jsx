import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Plus, Info, Clock, BadgeCent } from 'lucide-react';
import api from '../utils/api';
import Modal from './Modal';
import Loading from './Loading';
import { formatCurrency } from '../utils/helpers';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/public/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-graybg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-teal font-semibold text-sm uppercase tracking-wider block mb-2">Our Offerings</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight inline-block relative pb-3">
            Our Services
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-gold rounded-full" />
          </h2>
          <p className="text-navy/60 font-light text-base mt-4">
            Comprehensive dermatological care tailored to your needs. From medical dermatology to cosmetic skin therapies.
          </p>
        </div>

        {/* Loading / Content */}
        {loading ? (
          <Loading size="lg" />
        ) : (
          <div className="space-y-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 animate-fade-up ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-teal/15 text-teal p-2 rounded-lg">
                        <Sparkles size={20} />
                      </div>
                      <span className="text-navy/50 font-bold uppercase tracking-wider text-xs">
                        Category: Dermatology
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">
                      {service.name}
                    </h3>
                    
                    <p className="text-navy/70 font-light leading-relaxed text-base">
                      {service.description}
                    </p>

                    {/* Metadata bar */}
                    <div className="flex flex-wrap gap-6 py-4 border-y border-navy/5">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-teal" />
                        <span className="text-sm font-semibold text-navy">
                          Duration: {service.duration || 30} mins
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BadgeCent size={16} className="text-gold" />
                        <span className="text-sm font-semibold text-navy">
                          Fee: {formatCurrency(service.fee)}
                        </span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center space-x-4 pt-2">
                      <Link 
                        to="/book" 
                        state={{ preselectedService: service.name }}
                        className="bg-teal hover:bg-teal-dark text-navy font-bold px-6 py-3 rounded-lg text-sm transition-all duration-300 shadow-glow"
                      >
                        Book This Treatment
                      </Link>
                      <button 
                        onClick={() => setSelectedService(service)}
                        className="text-navy/60 hover:text-navy flex items-center space-x-1.5 text-sm font-semibold transition-colors"
                      >
                        <Info size={16} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Premium Geometric Graphic Accent */}
                  <div className="flex-1 w-full max-w-md bg-navy rounded-xl p-8 aspect-video flex flex-col justify-between relative bg-gradient-to-tr from-navy to-navy-light border border-navy-light/40 shadow-premium overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full filter blur-xl group-hover:bg-teal/10 transition-all duration-500" />
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gold font-mono text-xs font-bold tracking-wider">
                        SERVICE SPEC 0{index + 1}
                      </span>
                      <span className="text-white/20 text-4xl font-extrabold select-none">
                        CF
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="block text-2xl font-bold text-white tracking-tight leading-snug">
                        {service.name}
                      </span>
                      <span className="block text-teal font-medium text-sm mt-1">
                        Professional Medical Care
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-4 text-white/50 text-xs">
                      <span>CLINICFLOW PLATFORM</span>
                      <span className="text-gold font-bold">★ ★ ★ ★ ★</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Details Modal */}
      {selectedService && (
        <Modal 
          isOpen={!!selectedService} 
          onClose={() => setSelectedService(null)}
          title="Service Details"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-navy">{selectedService.name}</h4>
              <p className="text-teal font-medium text-sm mt-1">Clinical Skin Treatment</p>
            </div>
            
            <p className="text-navy/70 leading-relaxed font-light text-sm">
              {selectedService.description}
            </p>

            <div className="bg-graybg p-4 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-navy/40 font-bold uppercase">Estimated Duration</span>
                <span className="text-navy font-semibold text-base mt-0.5 block">{selectedService.duration || 30} minutes</span>
              </div>
              <div>
                <span className="block text-xs text-navy/40 font-bold uppercase">Consultation Fee</span>
                <span className="text-gold-dark font-semibold text-base mt-0.5 block">{formatCurrency(selectedService.fee)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 border border-gray-300 text-navy/70 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <Link 
                to="/book" 
                state={{ preselectedService: selectedService.name }}
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 bg-teal hover:bg-teal-dark text-navy font-bold rounded transition-colors text-sm shadow-glow"
              >
                Book Now
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </section>
  );
};

export default Services;
