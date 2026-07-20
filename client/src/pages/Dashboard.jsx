import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ClipboardCheck, ArrowUpRight, ClipboardList, CheckCircle, FileText } from 'lucide-react';
import StatsRow from '../components/StatsRow';
import AppointmentItem from '../components/AppointmentItem';
import api from '../utils/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Note details modal
  const [activeNotesApp, setActiveNotesApp] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    todayCount: 0,
    tomorrowCount: 0,
    totalPatients: 0,
    pendingCount: 0
  });

  const getTodayDateStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTomorrowDateStr = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const fetchData = async () => {
    try {
      const todayStr = getTodayDateStr();
      const tomorrowStr = getTomorrowDateStr();

      const [appRes, patRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients')
      ]);

      const allApps = appRes.data;
      const allPats = patRes.data;

      setAppointments(allApps);
      setPatients(allPats);

      // Compute statistics
      const todayCount = allApps.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
      const tomorrowCount = allApps.filter(a => a.date === tomorrowStr && a.status !== 'cancelled').length;
      const pendingCount = allApps.filter(a => a.status === 'pending').length;

      setStats({
        todayCount,
        tomorrowCount,
        totalPatients: allPats.length,
        pendingCount
      });

    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/appointments/${appId}/status`, { status: newStatus });
      // Reload stats and items
      fetchData();
    } catch (error) {
      console.error('Failed to change status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeNotesApp) return;
    setSavingNotes(true);
    try {
      await api.put(`/appointments/${activeNotesApp.id}/status`, { notes: editingNotes });
      setActiveNotesApp(null);
      fetchData();
    } catch (error) {
      console.error('Error saving visit notes:', error);
      alert('Error saving notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const openNotesModal = (app) => {
    setActiveNotesApp(app);
    setEditingNotes(app.notes || '');
  };

  if (loading) {
    return <Loading size="lg" />;
  }

  const todayDateStr = getTodayDateStr();
  const todayAppointments = appointments.filter(a => a.date === todayDateStr);

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* Stats Ribbon */}
      <StatsRow stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Today's Timeline */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-xl shadow-premium p-6">
          <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-navy">Today's Timeline</h3>
              <p className="text-xs text-navy/40 mt-1">Review scheduled treatments and change statuses.</p>
            </div>
            <span className="text-xs font-bold text-teal bg-teal/10 px-2.5 py-1 rounded">
              {todayDateStr}
            </span>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="text-center py-16 text-navy/40 font-medium text-sm border border-dashed border-gray-100 rounded-lg">
              📅 No consultations scheduled for today.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayAppointments.map((app) => (
                <AppointmentItem
                  key={app.id}
                  appointment={app}
                  onStatusChange={handleStatusChange}
                  onViewNotes={openNotesModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-premium p-6">
            <h3 className="font-bold text-base text-navy mb-4">Quick Controls</h3>
            <div className="space-y-3">
              <Link 
                to="/book" 
                target="_blank"
                className="w-full bg-teal hover:bg-teal-dark text-navy font-bold py-3 px-4 rounded-lg text-sm transition-colors flex items-center justify-between shadow-glow"
              >
                <span>Add Appointment</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link 
                to="/dashboard/patients"
                className="w-full bg-navy hover:bg-navy-light text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors flex items-center justify-between"
              >
                <span>View All Patients</span>
                <Users size={16} />
              </Link>
            </div>
          </div>

          {/* Pending Requests Alert List */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-premium p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-navy">Pending Requests</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                {stats.pendingCount}
              </span>
            </div>
            
            {appointments.filter(a => a.status === 'pending').length === 0 ? (
              <p className="text-xs text-navy/40 py-4 font-medium italic">All booking requests processed.</p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {appointments
                  .filter(a => a.status === 'pending')
                  .slice(0, 5)
                  .map((app) => (
                    <div 
                      key={app.id} 
                      className="p-3 bg-graybg/75 rounded-lg border border-navy/5 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-navy block">{app.patient?.name}</span>
                        <span className="text-[10px] text-teal-dark font-medium block mt-0.5">{app.serviceName}</span>
                        <span className="text-[10px] text-navy/40 block mt-0.5">{app.date} at {app.time}</span>
                      </div>
                      <div className="flex space-x-1 shrink-0">
                        <button
                          onClick={() => handleStatusChange(app.id, 'confirmed')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                {stats.pendingCount > 5 && (
                  <Link 
                    to="/dashboard/appointments" 
                    className="block text-center text-xs font-bold text-teal hover:underline pt-2"
                  >
                    View all pending ({stats.pendingCount})
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Appointment Notes Modal */}
      {activeNotesApp && (
        <Modal
          isOpen={!!activeNotesApp}
          onClose={() => setActiveNotesApp(null)}
          title="Clinical & Visit Notes"
        >
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold text-navy/40 uppercase">Patient</span>
              <span className="font-bold text-navy text-sm block mt-0.5">{activeNotesApp.patient?.name}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-navy/40 uppercase">Treatment</span>
              <span className="font-semibold text-navy text-sm block mt-0.5">{activeNotesApp.serviceName}</span>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Visit Notes / Diagnosis</label>
              <textarea
                rows="4"
                placeholder="Enter diagnostic details, prescriptions, or skin analysis notes..."
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none resize-none"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setActiveNotesApp(null)}
                className="px-4 py-2 border border-gray-300 text-navy/70 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-5 py-2 bg-teal hover:bg-teal-dark text-navy font-bold rounded transition-colors text-sm shadow-glow"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Dashboard;
