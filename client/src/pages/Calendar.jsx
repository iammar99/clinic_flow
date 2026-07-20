import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import Loading from '../components/Loading';
import { formatTime, getStatusColor } from '../utils/helpers';

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
        // Default select today's date string
        const todayStr = new Date().toISOString().split('T')[0];
        setSelectedDateStr(todayStr);
      } catch (error) {
        console.error('Error fetching calendar appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Days in month calculator
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate calendar days
  const calendarCells = [];
  // Spacers for previous month offset
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  // Get appointments for a specific day cell
  const getDayAppointments = (dayNum) => {
    if (!dayNum) return [];
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    return appointments.filter(app => app.date === dateStr);
  };

  // Convert day number to YYYY-MM-DD
  const getDayString = (dayNum) => {
    if (!dayNum) return '';
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
  };

  // Dot color mapper by status
  const getDotColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return <Loading size="lg" />;
  }

  const selectedDateApps = appointments.filter(app => app.date === selectedDateStr);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* Legend & Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-premium">
        
        {/* Status Legends */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-navy/70">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pending</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Confirmed</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Completed</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Cancelled</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <button 
            onClick={handleGoToToday}
            className="px-3.5 py-1.5 bg-graybg hover:bg-gray-200 text-navy font-bold text-xs rounded transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-gray-200 rounded">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-50 border-r border-gray-200 text-navy"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-50 text-navy"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Custom Month Calendar View */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-xl shadow-premium p-6">
          
          <div className="text-center font-bold text-lg text-navy tracking-tight mb-6 flex justify-center items-center space-x-2">
            <CalendarIcon size={20} className="text-teal" />
            <span>{monthNames[month]} {year}</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Week days labels */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div 
                key={day} 
                className="text-center font-bold text-[11px] text-navy/40 uppercase tracking-widest py-2"
              >
                {day}
              </div>
            ))}

            {/* Day grid cells */}
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-gray-50/50 rounded-lg aspect-square border border-transparent" />;
              }

              const cellDateStr = getDayString(day);
              const dayApps = getDayAppointments(day);
              const isCellSelected = cellDateStr === selectedDateStr;
              const isToday = cellDateStr === todayStr;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDateStr(cellDateStr)}
                  className={`aspect-square rounded-lg border flex flex-col justify-between p-2.5 transition-all text-left relative group ${
                    isCellSelected
                      ? 'border-teal bg-teal/5 shadow-glow font-extrabold'
                      : isToday
                        ? 'border-teal/40 bg-teal/10 hover:border-teal hover:bg-teal/5'
                        : 'border-gray-100 hover:border-teal/30 hover:bg-graybg/40'
                  }`}
                >
                  {/* Day number */}
                  <span className={`text-xs font-bold ${
                    isToday ? 'text-teal-dark font-extrabold' : 'text-navy'
                  }`}>
                    {day}
                  </span>

                  {/* Dot status indicators */}
                  {dayApps.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                      {dayApps.slice(0, 3).map((app, appIdx) => (
                        <span 
                          key={appIdx}
                          className={`w-1.5 h-1.5 rounded-full ${getDotColor(app.status)}`}
                          title={`${app.patient?.name} - ${app.status}`}
                        />
                      ))}
                      {dayApps.length > 3 && (
                        <span className="text-[8px] leading-none text-navy/40 font-bold shrink-0">
                          +{dayApps.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Visual accent ring for selected item */}
                  {isCellSelected && (
                    <div className="absolute inset-0.5 rounded-md border border-teal pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Date-specific Appointments Detail Sidebar */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl shadow-premium p-6 space-y-5">
          <div>
            <h3 className="font-bold text-base text-navy">Schedule Details</h3>
            <p className="text-xs text-navy/40 mt-1">{selectedDateStr ? `Appointments for ${selectedDateStr}` : 'Select a date'}</p>
          </div>

          {selectedDateApps.length === 0 ? (
            <div className="text-center py-12 text-xs text-navy/40 font-semibold border border-dashed border-gray-100 rounded-lg">
              📅 No consultations scheduled.
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedDateApps.map((app) => (
                <div 
                  key={app.id} 
                  className="p-4 bg-graybg/50 border border-gray-100 hover:border-teal/30 rounded-lg text-xs space-y-2 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-teal-dark flex items-center space-x-1">
                      <Clock size={12} className="shrink-0" />
                      <span>{formatTime(app.time)}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-navy text-sm block leading-tight">{app.patient?.name}</span>
                    <span className="text-navy/50 font-semibold block">{app.serviceName}</span>
                  </div>

                  {app.notes && (
                    <p className="text-[10px] text-navy/40 border-t border-navy/5 pt-1.5 leading-relaxed font-light italic">
                      Notes: {app.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Calendar;
