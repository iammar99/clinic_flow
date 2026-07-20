import React from 'react';
import { Calendar, BookOpen, Globe, Award, Check } from 'lucide-react';

const About = () => {
  const highlights = [
    { title: 'Clinical Expertise', desc: 'Expert diagnosis and management of chronic skin, hair, and nail conditions.' },
    { title: 'Aesthetic Procedures', desc: 'State-of-the-art non-surgical facial rejuvenation, laser, and anti-aging therapies.' },
    { title: 'Patient-First Care', desc: 'Tailored treatments combining clinical safety with highly personalized aesthetic goals.' }
  ];

  const education = [
    { year: '2010', title: 'MBBS', institution: 'Dow University of Health Sciences, Karachi' },
    { year: '2014', title: 'FCPS (Dermatology)', institution: 'College of Physicians and Surgeons Pakistan' },
    { year: '2016', title: 'Aesthetic Laser Specialization', institution: 'International Academy of Aesthetic Medicine, London' }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Text and Timeline */}
        <div className="lg:col-span-7 space-y-8 animate-fade-up">
          <div>
            <span className="text-teal font-semibold text-sm uppercase tracking-wider block mb-2">
              About Dr. Ali Ahmed
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">
              Dedicated to Excellence in Skin Care
            </h2>
          </div>

          <p className="text-navy/70 leading-relaxed font-light text-base">
            Dr. Ali Ahmed believes that healthy skin is the foundation of confidence. Over his 12-year career in dermatology, he has successfully treated thousands of patients in Karachi, combining rigorous clinical medicine with the latest artistic advancements in aesthetic dermatology. His philosophy centers on natural-looking enhancements and medically sound therapeutic regimens.
          </p>

          {/* Education timeline */}
          <div className="space-y-4">
            <h3 className="text-navy font-semibold text-lg flex items-center space-x-2">
              <BookOpen size={20} className="text-teal" />
              <span>Qualifications & Credentials</span>
            </h3>
            <div className="border-l border-teal/30 ml-3.5 pl-6 space-y-5">
              {education.map((edu, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-teal border-2 border-white shadow-glow" />
                  <span className="text-xs font-bold text-gold block mb-0.5">{edu.year}</span>
                  <h4 className="font-semibold text-navy text-sm">{edu.title}</h4>
                  <p className="text-xs text-navy/60">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center space-x-6 pt-2">
            <div className="flex items-center space-x-2 text-navy/80 text-sm">
              <Globe size={18} className="text-teal shrink-0" />
              <span className="font-semibold">Languages:</span>
            </div>
            <div className="flex space-x-2">
              <span className="bg-graybg px-3 py-1 rounded text-xs font-medium text-navy">English</span>
              <span className="bg-graybg px-3 py-1 rounded text-xs font-medium text-navy">Urdu</span>
              <span className="bg-graybg px-3 py-1 rounded text-xs font-medium text-navy">Sindhi</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image and Horizontal strips */}
        <div className="lg:col-span-5 space-y-8 animate-fade-up">
          {/* Main pose image placeholder (using luxury styling) */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-1/3 h-1/3 border-t-2 border-l-2 border-gold pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-1/3 h-1/3 border-b-2 border-r-2 border-gold pointer-events-none" />
            
            <div className="bg-navy rounded-lg p-1.5 shadow-premium overflow-hidden aspect-[4/5] flex items-center justify-center bg-gradient-to-tr from-navy to-navy-light border border-navy-light">
              <svg 
                viewBox="0 0 150 180" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-2/3 h-2/3 text-teal/40"
              >
                <circle cx="75" cy="60" r="28" stroke="currentColor" strokeWidth="2" />
                <path d="M75 100L75 170M45 140L105 140" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="35" y="100" width="80" height="70" rx="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="absolute bottom-6 left-6 text-white bg-navy/90 border border-teal/30 px-4 py-2.5 rounded shadow-glow">
                <p className="text-xs text-teal font-bold uppercase tracking-wider">Clinic Philosophy</p>
                <p className="text-sm font-semibold mt-0.5">Evidence-Based Dermatology</p>
              </div>
            </div>
          </div>

          {/* Horizontal experience strips (NO cards) */}
          <div className="space-y-3.5">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-3.5 py-3.5 px-4 border-b border-gray-100 hover:border-teal/30 transition-all duration-300"
              >
                <div className="bg-teal/10 p-1.5 rounded-full text-teal shrink-0">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-navy text-sm tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-navy/60 mt-0.5 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
