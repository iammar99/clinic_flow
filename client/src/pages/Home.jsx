import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // If we redirected to Home with scrollTo instruction
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {/* Patient header navigation */}
      <Header />

      {/* Hero section */}
      <Hero />

      {/* Doctor Philosophy & About section */}
      <About />

      {/* Services Zigzag section */}
      <Services />

      {/* Testimonials Quote slider section */}
      <Testimonials />

      {/* Contact details & Map section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
