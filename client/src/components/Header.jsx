import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    // If not on Home page, navigate to Home page first and then scroll
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy/95 border-b border-navy-light/35 shadow-premium py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-teal font-extrabold text-2xl tracking-tight">Clinic</span>
          <span className="text-white font-medium text-2xl tracking-tight">Flow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-white/80 hover:text-teal font-medium text-sm transition-colors tracking-wide"
            >
              {link.label}
            </button>
          ))}
          <Link 
            to="/login" 
            className="text-white/60 hover:text-white flex items-center space-x-1.5 font-medium text-sm transition-colors"
            title="Doctor Portal"
          >
            <ShieldAlert size={14} className="text-gold" />
            <span>Doctor Portal</span>
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link 
            to="/book" 
            className="bg-teal hover:bg-teal-dark text-navy font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-300 shadow-glow hover:scale-102"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white hover:text-teal focus:outline-none p-1"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy border-b border-navy-light/40 py-6 px-6 flex flex-col space-y-4 animate-fade-up">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-white/80 hover:text-teal font-medium text-base text-left py-2 border-b border-navy-light/10"
            >
              {link.label}
            </button>
          ))}
          <Link 
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gold hover:text-white py-2 flex items-center space-x-2 font-medium border-b border-navy-light/10"
          >
            <ShieldAlert size={16} />
            <span>Doctor Portal</span>
          </Link>
          <Link 
            to="/book"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-teal hover:bg-teal-dark text-navy text-center font-semibold py-3 rounded-lg text-base transition-colors shadow-glow"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
