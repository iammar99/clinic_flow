import React, { useState, useEffect } from 'react';
import { Search, User, Eye, Calendar, Plus, Clock, FileText, BadgeCent, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import PatientItem from '../components/PatientItem';
import { formatDate, formatTime, getStatusColor, formatCurrency } from '../utils/helpers';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Patient details
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get('/patients', { params });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  // Fetch patient details when selected ID changes
  useEffect(() => {
    if (!selectedPatientId) {
      setPatientDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const response = await api.get(`/patients/${selectedPatientId}`);
        setPatientDetail(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
        alert('Could not fetch patient records.');
        setSelectedPatientId(null);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetail();
  }, [selectedPatientId]);

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* Search Filter Box */}
      <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-premium">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" size={16} />
          <input
            type="text"
            placeholder="Search patients by name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-graybg focus:bg-white border border-transparent focus:border-teal rounded-lg text-sm focus:outline-none text-navy font-medium shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Patients Table Container */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-premium overflow-hidden">
        
        {loading ? (
          <div className="py-20"><Loading size="lg" /></div>
        ) : patients.length === 0 ? (
          <div className="text-center py-20 text-navy/40 font-medium text-sm">
            👥 No patient profiles found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-graybg border-b border-gray-100 text-navy/50 font-bold uppercase tracking-widest text-[10px]">
                  <th className="px-6 py-4">Patient Profile</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Total Bookings</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((pat) => (
                  <PatientItem
                    key={pat.id}
                    patient={pat}
                    onViewDetail={setSelectedPatientId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Patient Visit History Modal */}
      {selectedPatientId && (
        <Modal
          isOpen={!!selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          title="Patient History & Charts"
          size="lg"
        >
          {detailLoading || !patientDetail ? (
            <div className="py-12"><Loading /></div>
          ) : (
            <div className="space-y-6">
              
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-graybg p-5 rounded-lg border border-navy/5 gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-navy text-teal flex items-center justify-center font-extrabold text-base border border-teal/20 shrink-0">
                    {patientDetail.name?.charAt(0) || 'P'}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-navy">{patientDetail.name}</h4>
                    <span className="text-xs text-navy/40 font-medium font-mono block mt-0.5">{patientDetail.phone}</span>
                  </div>
                </div>
                
                <div className="flex flex-col text-sm text-navy/70 space-y-1">
                  {patientDetail.email && (
                    <span className="flex items-center space-x-1.5">
                      <span className="text-navy/40 font-bold text-xs uppercase w-12">Email:</span>
                      <span className="font-medium">{patientDetail.email}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1.5">
                    <span className="text-navy/40 font-bold text-xs uppercase w-12">Joined:</span>
                    <span className="font-medium">{formatDate(patientDetail.createdAt?.split('T')[0])}</span>
                  </span>
                </div>
              </div>

              {/* Patient General Info Notes */}
              {patientDetail.notes && (
                <div className="space-y-1.5">
                  <span className="block text-xs font-bold text-navy/40 uppercase tracking-wider">Patient Background & Notes</span>
                  <div className="bg-amber-50/50 border border-amber-100/60 p-4 rounded text-xs text-navy/80 leading-relaxed font-light">
                    {patientDetail.notes}
                  </div>
                </div>
              )}

              {/* Visit History list */}
              <div className="space-y-3.5">
                <h4 className="text-sm font-bold text-navy uppercase tracking-wider">Visit Records ({patientDetail.appointments?.length || 0})</h4>
                
                {(!patientDetail.appointments || patientDetail.appointments.length === 0) ? (
                  <p className="text-xs text-navy/40 italic py-2">No bookings recorded for this patient.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {patientDetail.appointments.map((app) => (
                      <div 
                        key={app.id} 
                        className="p-4 bg-white border border-gray-100 hover:border-teal/30 rounded-lg text-xs space-y-2.5 transition-all shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-teal-dark flex items-center space-x-1">
                            <Calendar size={12} className="shrink-0" />
                            <span>{formatDate(app.date)}</span>
                            <span className="text-navy/20 mx-1">|</span>
                            <Clock size={12} className="shrink-0" />
                            <span>{formatTime(app.time)}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>

                        <div>
                          <span className="font-semibold text-navy text-sm block leading-tight">{app.serviceName}</span>
                        </div>

                        {app.notes ? (
                          <div className="text-[10px] text-navy/60 bg-graybg/50 p-2.5 rounded leading-relaxed font-light italic border-l-2 border-teal">
                            <span className="font-bold text-navy/40 uppercase block text-[8px] tracking-wider mb-1">Clinical Entry Notes:</span>
                            {app.notes}
                          </div>
                        ) : (
                          <span className="text-[10px] text-navy/30 italic block">No consultation chart written for this visit.</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close controls */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedPatientId(null)}
                  className="px-5 py-2 bg-navy hover:bg-navy-light text-white font-bold rounded transition-colors text-sm"
                >
                  Close Records
                </button>
              </div>

            </div>
          )}
        </Modal>
      )}

    </div>
  );
};

export default Patients;
