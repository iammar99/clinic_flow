import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Dr. Ali Ahmed completely transformed my skin. I suffered from adult acne for years, and his customized plan cleared my skin in less than three months. The best dermatologist in Karachi!",
      name: "Ayesha Khan",
      treatment: "Acne Scar Revision"
    },
    {
      quote: "Outstanding experience! The clinic is clean, private, and Dr. Ali takes the time to explain the science behind the treatments. My laser sessions were painless and yielded incredible results.",
      name: "Kamran Shah",
      treatment: "Laser Skin Rejuvenation"
    },
    {
      quote: "I visited Dr. Ali for a chemical peel and HydraFacial. The glow on my face was immediate. His gentle approach and expertise are unmatched. Highly recommended!",
      name: "Zainab Fatima",
      treatment: "Chemical Peel"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden relative">
      {/* Decorative large backdrop elements */}
      <div className="absolute top-10 left-10 text-graybg select-none pointer-events-none text-9xl font-serif font-black opacity-30">
        “
      </div>
      <div className="absolute bottom-10 right-10 text-graybg select-none pointer-events-none text-9xl font-serif font-black opacity-30">
        ”
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
        
        {/* Header */}
        <div>
          <span className="text-teal font-semibold text-sm uppercase tracking-wider block mb-2">Patient Feedback</span>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
            Client Testimonials
          </h2>
        </div>

        {/* Carousel Slider */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          {testimonials.map((test, index) => {
            const isActive = index === currentIndex;
            return (
              <div 
                key={index}
                className={`transition-all duration-700 ease-in-out absolute w-full max-w-2xl px-4 ${
                  isActive 
                    ? 'opacity-100 translate-x-0 pointer-events-auto scale-100' 
                    : 'opacity-0 translate-x-12 pointer-events-none scale-95'
                }`}
              >
                <div className="flex justify-center text-teal mb-6">
                  <Quote size={40} className="opacity-70" />
                </div>
                
                <p className="text-lg md:text-xl text-navy/85 leading-relaxed font-light italic">
                  "{test.quote}"
                </p>

                {/* Rating */}
                <div className="flex justify-center space-x-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-navy text-base">{test.name}</h4>
                  <p className="text-teal text-xs font-semibold tracking-wide uppercase mt-0.5">{test.treatment}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full border border-navy/15 hover:border-teal hover:text-teal text-navy/70 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-teal w-6' : 'bg-navy/15'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full border border-navy/15 hover:border-teal hover:text-teal text-navy/70 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
