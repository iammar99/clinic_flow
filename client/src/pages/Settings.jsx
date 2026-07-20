import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import api from '../utils/api';
import Loading from '../components/Loading';
import { User, Clock, Stethoscope, Save, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const Settings = () => {
  const { doctor, updateDoctorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states (synced from doctor profile)
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState([]);
  const [langInput, setLangInput] = useState('');
  const [bio, setBio] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  
  // Timings settings (JSON object)
  const [workingHours, setWorkingHours] = useState({});

  // Holidays settings (JSON array of YYYY-MM-DD strings)
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState('');

  // Services list (JSON array of service items)
  const [services, setServices] = useState([]);
  
  // Add new service inputs
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceFee, setNewServiceFee] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || '');
      setSpecialty(doctor.specialty || '');
      setQualifications(doctor.qualifications || '');
      setExperience(doctor.experience || '');
      setLanguages(doctor.languages || []);
      setBio(doctor.bio || '');
      setClinicAddress(doctor.clinicAddress || '');
      setWorkingHours(doctor.workingHours || {});
      setHolidays(doctor.holidays || []);
      setServices(doctor.services || []);
    }
  }, [doctor]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await api.put('/profile', {
        name,
        specialty,
        qualifications,
        experience: Number(experience),
        languages,
        bio,
        clinicAddress
      });
      updateDoctorProfile(response.data.doctor);
      setSuccessMsg('Professional profile updated successfully.');
    } catch (error) {
      console.error('Error updating settings profile:', error);
      setErrorMsg('Failed to save profile changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimingsSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await api.put('/profile', {
        workingHours,
        holidays
      });
      updateDoctorProfile(response.data.doctor);
      setSuccessMsg('Timings and holidays configuration updated successfully.');
    } catch (error) {
      console.error('Error updating timings settings:', error);
      setErrorMsg('Failed to save timing settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleServicesSave = async (updatedServicesList) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await api.put('/profile', {
        services: updatedServicesList
      });
      updateDoctorProfile(response.data.doctor);
      setServices(response.data.doctor.services);
      setSuccessMsg('Clinic services registry updated.');
    } catch (error) {
      console.error('Error updating services configurations:', error);
      setErrorMsg('Failed to save services.');
    } finally {
      setLoading(false);
    }
  };

  // Language add/delete handlers
  const handleAddLanguage = () => {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  // Day toggle/start/end timings
  const handleDayToggle = (day) => {
    const updated = { ...workingHours };
    if (updated[day]) {
      updated[day] = null; // Closed
    } else {
      updated[day] = { start: '09:00', end: '17:00' }; // Default open timings
    }
    setWorkingHours(updated);
  };

  const handleTimeChange = (day, type, value) => {
    const updated = { ...workingHours };
    if (updated[day]) {
      updated[day] = {
        ...updated[day],
        [type]: value
      };
      setWorkingHours(updated);
    }
  };

  // Holiday handlers
  const handleAddHoliday = () => {
    if (newHoliday && !holidays.includes(newHoliday)) {
      setHolidays([...holidays, newHoliday].sort());
      setNewHoliday('');
    }
  };

  const handleRemoveHoliday = (dateString) => {
    setHolidays(holidays.filter(h => h !== dateString));
  };

  // Service CRUD within JSON
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServiceFee) {
      alert('Service name and fee are required.');
      return;
    }
    const newService = {
      name: newServiceName,
      description: newServiceDesc,
      duration: Number(newServiceDuration),
      fee: Number(newServiceFee)
    };
    const updated = [...services, newService];
    setServices(updated);
    handleServicesSave(updated);

    // Reset inputs
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServiceDuration(30);
    setNewServiceFee('');
  };

  const handleDeleteService = (idxToDelete) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updated = services.filter((_, idx) => idx !== idxToDelete);
      setServices(updated);
      handleServicesSave(updated);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* Alert Notices */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-sm font-semibold">
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold flex items-center space-x-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="border-b border-gray-200 flex space-x-6">
        <button
          onClick={() => {
            setActiveTab('profile');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'profile'
              ? 'border-teal text-navy'
              : 'border-transparent text-navy/40 hover:text-navy'
          }`}
        >
          <User size={16} />
          <span>Professional Profile</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('timings');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'timings'
              ? 'border-teal text-navy'
              : 'border-transparent text-navy/40 hover:text-navy'
          }`}
        >
          <Clock size={16} />
          <span>Timings & Holidays</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('services');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'services'
              ? 'border-teal text-navy'
              : 'border-transparent text-navy/40 hover:text-navy'
          }`}
        >
          <Stethoscope size={16} />
          <span>Clinic Services</span>
        </button>
      </div>

      {/* Tab Panel Renderings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-premium p-6 md:p-8">
        
        {/* Profile Tab Panel */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Medical Specialty</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Qualifications</label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  placeholder="e.g. MBBS, FCPS"
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Years of Experience</label>
                <input
                  type="number"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Languages Spoken</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add language e.g. Urdu..."
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  className="border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-4 py-2 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((lang) => (
                  <span 
                    key={lang} 
                    className="bg-graybg text-navy px-3 py-1 rounded text-xs font-bold flex items-center space-x-1.5"
                  >
                    <span>{lang}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLanguage(lang)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Bio Philosophy</label>
              <textarea
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider">Clinic Address</label>
              <input
                type="text"
                required
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-teal hover:bg-teal-dark text-navy font-bold px-6 py-3 rounded-lg text-sm transition-all duration-300 shadow-glow flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        )}

        {/* Timings Tab Panel */}
        {activeTab === 'timings' && (
          <form onSubmit={handleTimingsSave} className="space-y-8">
            
            {/* Days Timings grid */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2">Weekly Consultation Hours</h3>
              <div className="space-y-3.5 max-w-2xl">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const daySchedule = workingHours[day];
                  const isOpen = daySchedule !== null && daySchedule !== undefined;

                  return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 gap-4 text-sm">
                      <div className="flex items-center space-x-3.5 w-32 shrink-0">
                        <input
                          type="checkbox"
                          checked={isOpen}
                          onChange={() => handleDayToggle(day)}
                          className="rounded text-teal border-gray-300 focus:ring-teal"
                        />
                        <span className={`font-bold ${isOpen ? 'text-navy' : 'text-navy/30'}`}>{day}</span>
                      </div>

                      {isOpen ? (
                        <div className="flex items-center space-x-3.5">
                          <input
                            type="time"
                            value={daySchedule.start}
                            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                            className="border border-gray-200 focus:border-teal rounded p-1.5 text-xs text-navy"
                          />
                          <span className="text-navy/40 text-xs">to</span>
                          <input
                            type="time"
                            value={daySchedule.end}
                            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                            className="border border-gray-200 focus:border-teal rounded p-1.5 text-xs text-navy"
                          />
                        </div>
                      ) : (
                        <span className="text-red-400 font-bold text-xs">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Holidays Blocker list */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2">Holidays & Blocked Dates</h3>
              
              <div className="flex items-center space-x-3 max-w-sm">
                <input
                  type="date"
                  value={newHoliday}
                  onChange={(e) => setNewHoliday(e.target.value)}
                  className="border border-gray-200 focus:border-teal rounded-lg p-2.5 text-sm focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={handleAddHoliday}
                  className="px-4 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                >
                  Block Date
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {holidays.length === 0 ? (
                  <p className="text-xs text-navy/40 italic">No blocked dates recorded.</p>
                ) : (
                  holidays.map((date) => (
                    <span 
                      key={date} 
                      className="bg-red-50 text-red-600 border border-red-100 px-3.5 py-1 rounded text-xs font-bold flex items-center space-x-2"
                    >
                      <Calendar size={12} />
                      <span>{date}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveHoliday(date)}
                        className="hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-teal hover:bg-teal-dark text-navy font-bold px-6 py-3 rounded-lg text-sm transition-all duration-300 shadow-glow flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </form>
        )}

        {/* Services Tab Panel */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            
            {/* List current services */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-navy border-b border-gray-100 pb-2">Active Services</h3>
              
              {services.length === 0 ? (
                <p className="text-xs text-navy/40 italic">No services offered currently.</p>
              ) : (
                <div className="space-y-3 max-w-3xl">
                  {services.map((service, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-gray-100 rounded-lg flex justify-between items-start hover:border-teal/30 transition-all text-xs"
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-sm font-bold text-navy block">{service.name}</span>
                        <span className="text-navy/50 block font-light leading-relaxed">{service.description}</span>
                        <span className="text-[10px] text-teal-dark font-medium block mt-1">Duration: {service.duration} mins</span>
                      </div>
                      <div className="flex items-center space-x-6 shrink-0">
                        <span className="font-extrabold text-navy text-sm">{formatCurrency(service.fee)}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add new Service Form */}
            <form onSubmit={handleAddService} className="space-y-4 bg-graybg p-6 rounded-xl border border-navy/5 max-w-3xl">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Add Clinic Treatment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-navy uppercase tracking-wider">Service Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical Peel"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-2.5 text-xs bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-navy uppercase tracking-wider">Consultation Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newServiceFee}
                    onChange={(e) => setNewServiceFee(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-2.5 text-xs bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-navy uppercase tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-2.5 text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-navy uppercase tracking-wider">Description</label>
                <textarea
                  rows="2"
                  placeholder="Write a brief explanation of the treatment..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-2.5 text-xs bg-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-navy hover:bg-navy-light text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>Save New Service</span>
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
};

export default Settings;
