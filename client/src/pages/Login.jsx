import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../App';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.doctor);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-graybg font-sans text-darktext">
      
      {/* Left side: Branding / Tagline */}
      <div className="flex-1 bg-navy text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden">
        
        {/* Glow indicators */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-teal/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <Link to="/" className="flex items-center space-x-1.5 self-start z-10">
          <span className="text-teal font-extrabold text-2xl tracking-tight">Clinic</span>
          <span className="text-white font-medium text-2xl tracking-tight">Flow</span>
        </Link>

        {/* Center Intro */}
        <div className="max-w-md my-auto space-y-4 z-10">
          <span className="text-gold font-bold text-xs uppercase tracking-widest block">ADMINISTRATOR PORTAL</span>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Manage ClinicFlow Platform
          </h1>
          <p className="text-white/60 font-light text-sm leading-relaxed">
            Authorized access only. Log in to manage patient appointments, update available timings, and write consultation charts.
          </p>
        </div>

        {/* Bottom footer indicator */}
        <div className="text-xs text-white/30 z-10">
          ClinicFlow Management Systems. Security token JWT-active.
        </div>

      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-navy tracking-tight">Sign In</h2>
            <p className="text-navy/50 text-xs font-medium">Please enter your doctor credentials to access the dashboard.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center space-x-2 text-sm animate-fade-up">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="doctor@clinicflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 pr-10 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-navy/55">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input type="checkbox" className="rounded text-teal border-gray-300 focus:ring-teal" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:text-teal transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal hover:bg-teal-dark text-navy font-bold py-3.5 rounded-lg text-sm transition-colors shadow-glow flex items-center justify-center space-x-2"
            >
              <ShieldCheck size={18} />
              <span>{loading ? 'Authenticating...' : 'Secure Log In'}</span>
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;
