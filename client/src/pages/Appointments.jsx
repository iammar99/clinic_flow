import React, { useState, useEffect } from 'react';
import { Search, ClipboardList, CheckCircle2, XCircle, Check, X, FileText } from 'lucide-react';
import api from '../utils/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { formatDate, formatTime, getStatusColor } from '../utils/helpers';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Notes Modal state
  const [activeNotesApp, setActiveNotesApp] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Construct query params
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get('/appointments', { params });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, search]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/appointments/${appId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to change status:', error);
      alert('Error updating status.');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeNotesApp) return;
    setSavingNotes(true);
    try {
      await api.put(`/appointments/${activeNotesApp.id}/status`, { notes: editingNotes });
      setActiveNotesApp(null);
      fetchAppointments();
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

  const filters = [
    { label: 'All Appointments', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* Controls & Filters Header */}
      <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-premium space-y-6">
        
        {/* Search bar & Status filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filters buttons list */}
          <div className="flex flex-wrap items-center gap-1.5 bg-graybg p-1 rounded-lg self-start">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                  statusFilter === filter.value
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-navy/60 hover:text-navy'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" size={16} />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-graybg focus:bg-white border border-transparent focus:border-teal rounded-lg text-sm focus:outline-none text-navy font-medium shadow-sm transition-all"
            />
          </div>

        </div>

      </div>

      {/* Appointments List Content */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-premium overflow-hidden">
        
        {loading ? (
          <div className="py-20"><Loading size="lg" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 text-navy/40 font-medium text-sm">
            📋 No appointments found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-graybg border-b border-gray-100 text-navy/50 font-bold uppercase tracking-widest text-[10px]">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Treatment Service</th>
                  <th className="px-6 py-4">Appointment Date</th>
                  <th className="px-6 py-4">Scheduled Time</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-graybg/30 transition-colors text-sm">
                    {/* Patient Name */}
                    <td className="px-6 py-4 font-bold text-navy">
                      <div className="space-y-0.5">
                        <span>{app.patient?.name}</span>
                        <span className="block text-[10px] text-navy/40 font-medium font-mono">{app.patient?.phone}</span>
                      </div>
                    </td>

                    {/* Treatment Service */}
                    <td className="px-6 py-4 text-navy/80 font-medium">
                      {app.serviceName}
                    </td>

                    {/* Appointment Date */}
                    <td className="px-6 py-4 text-navy/70">
                      {formatDate(app.date)}
                    </td>

                    {/* Scheduled Time */}
                    <td className="px-6 py-4 text-teal-dark font-semibold">
                      {formatTime(app.time)}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Note Viewer */}
                        <button
                          onClick={() => openNotesModal(app)}
                          className="p-1.5 rounded hover:bg-gray-100 text-navy/40 hover:text-teal transition-colors"
                          title="View/Edit Visit Notes"
                        >
                          <FileText size={15} />
                        </button>

                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, 'confirmed')}
                              className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                              title="Confirm Appointment"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'cancelled')}
                              className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Cancel Appointment"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                        {app.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app.id, 'completed')}
                              className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Mark Completed"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'cancelled')}
                              className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Cancel Appointment"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

export default Appointments;
