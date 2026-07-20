import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../App';
import { LogOut, Menu, User, Bell } from 'lucide-react';

const DashboardLayout = () => {
  const { doctor, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Map route pathname to clean title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview Dashboard';
    if (path.includes('/dashboard/calendar')) return 'Interactive Calendar';
    if (path.includes('/dashboard/appointments')) return 'Appointments Registry';
    if (path.includes('/dashboard/patients')) return 'Patient Health Records';
    if (path.includes('/dashboard/settings')) return 'Platform Settings';
    return 'Doctor Dashboard';
  };

  return (
    <div className="flex h-screen bg-graybg overflow-hidden font-sans text-darktext">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={handleLogout} 
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Dashboard Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
          
          <div className="flex items-center space-x-3">
            {/* Mobile Menu trigger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-navy hover:text-teal focus:outline-none p-1"
            >
              <Menu size={22} />
            </button>
            <h2 className="font-bold text-lg text-navy tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Simulation alert */}
            <span className="hidden sm:inline-flex items-center bg-teal/10 text-teal-dark border border-teal/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              🟢 ONLINE PORTAL
            </span>

            {/* Profile trigger */}
            <div className="flex items-center space-x-2.5 border-l border-gray-100 pl-4">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-teal font-extrabold text-sm border border-teal/30">
                {doctor?.name?.charAt(0) || 'D'}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-navy">{doctor?.name || 'Dr. Ali Ahmed'}</span>
                <span className="block text-[10px] text-navy/40 font-semibold">{doctor?.specialty || 'Dermatologist'}</span>
              </div>
            </div>

          </div>

        </header>

        {/* Dynamic Nested Screen Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
