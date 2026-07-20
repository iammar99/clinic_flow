import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardList, Users, Settings, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, onLogout }) => {
  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
    { label: 'Appointments', path: '/dashboard/appointments', icon: ClipboardList },
    { label: 'Patients', path: '/dashboard/patients', icon: Users },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Core */}
      <aside 
        className={`w-64 bg-navy border-r border-navy-light/30 flex flex-col justify-between fixed lg:relative h-full z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-navy-light/20">
            <Link to="/dashboard" className="flex items-center space-x-1.5" onClick={() => setIsOpen(false)}>
              <span className="text-teal font-extrabold text-xl tracking-tight">Clinic</span>
              <span className="text-white font-medium text-xl tracking-tight">Flow</span>
            </Link>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-white/50 hover:text-teal focus:outline-none p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 tracking-wide ${
                    isActive
                      ? 'bg-teal text-navy shadow-glow font-extrabold'
                      : 'text-white/70 hover:text-white hover:bg-navy-light/50'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Control / Logout */}
        <div className="p-4 border-t border-navy-light/10">
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
