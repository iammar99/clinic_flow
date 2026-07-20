import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../utils/api';
import Loading from './Loading';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';

const BookingForm = () => {
  const location = useLocation();
  const preselectedService = location.state?.preselectedService || '';

  // Step state
  const [step, setStep] = useState(1);

  // Form inputs
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // API Slot states
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotStatusInfo, setSlotStatusInfo] = useState(null); // { isClosed, isHoliday }

  // Status states
  const [servicesLoading, setServicesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Get min/max date strings for scheduling (today to 30 days out)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  // Fetch services on load
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/public/services');
        setServices(response.data);
        if (preselectedService) {
          const matched = response.data.find(s => s.name === preselectedService);
          if (matched) setSelectedService(matched);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, [preselectedService]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setErrorMsg('');
      setSelectedTime(''); // Reset selected time slot
      try {
        const response = await api.get(`/public/doctor?date=${selectedDate}`);
        const info = response.data.slotsInfo;
        if (info) {
          setAvailableSlots(info.availableSlots || []);
          setSlotStatusInfo({
            isClosed: info.isClosed,
            isHoliday: info.isHoliday
          });
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setErrorMsg('Could not fetch available slots. Please try another date.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const handleNextStep = () => {
    if (step === 1 && !selectedService) {
      setErrorMsg('Please select a service first.');
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      setErrorMsg('Please choose a valid date and time slot.');
      return;
    }
    setErrorMsg('');
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        patientName,
        patientPhone,
        patientEmail,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        notes
      };

      const response = await api.post('/public/book', payload);
      setSuccessData(response.data);
    } catch (error) {
      console.error('Booking error:', error);
      setErrorMsg(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Success screen
  if (successData) {
    return (
      <div className="bg-white border border-navy/5 shadow-premium rounded-xl p-8 max-w-xl mx-auto text-center space-y-6 animate-fade-up">
        <div className="flex justify-center text-teal">
          <CheckCircle2 size={64} className="animate-pulse" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-navy">Appointment Booked!</h3>
          <p className="text-navy/50 text-sm mt-1">Your request has been registered and is pending doctor confirmation.</p>
        </div>

        <div className="bg-graybg p-6 rounded-lg text-left space-y-3.5 border border-navy/5">
          <div className="flex justify-between border-b border-navy/5 pb-2 text-sm">
            <span className="text-navy/50">Patient Name:</span>
            <span className="font-semibold text-navy">{successData.patient?.name}</span>
          </div>
          <div className="flex justify-between border-b border-navy/5 pb-2 text-sm">
            <span className="text-navy/50">Treatment:</span>
            <span className="font-semibold text-navy">{successData.serviceName}</span>
          </div>
          <div className="flex justify-between border-b border-navy/5 pb-2 text-sm">
            <span className="text-navy/50">Date:</span>
            <span className="font-semibold text-navy">{formatDate(successData.date)}</span>
          </div>
          <div className="flex justify-between pb-1 text-sm">
            <span className="text-navy/50">Time Slot:</span>
            <span className="font-semibold text-teal-dark">{formatTime(successData.time)}</span>
          </div>
        </div>

        <div className="p-4 bg-teal/10 rounded-lg text-teal-dark text-xs font-semibold leading-relaxed">
          💬 We have logged a WhatsApp confirmation request. Dr. Ahmed will review and confirm your slot shortly.
        </div>

        <button 
          onClick={() => {
            // Reset form
            setStep(1);
            setSelectedService(null);
            setSelectedDate('');
            setSelectedTime('');
            setPatientName('');
            setPatientPhone('');
            setPatientEmail('');
            setNotes('');
            setSuccessData(null);
          }}
          className="w-full bg-navy hover:bg-navy-light text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-initial">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs border transition-all ${
              step >= s 
                ? 'bg-teal border-teal text-navy shadow-glow font-extrabold' 
                : 'bg-white border-gray-200 text-gray-400'
            }`}>
              {s}
            </div>
            <span className={`ml-2 text-xs font-semibold hidden sm:inline ${
              step >= s ? 'text-navy' : 'text-gray-400'
            }`}>
              {s === 1 ? 'Select Service' : s === 2 ? 'Date & Time' : 'Patient Info'}
            </span>
            {s < 3 && (
              <div className={`h-[2px] mx-4 flex-1 transition-colors ${
                step > s ? 'bg-teal' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white border border-navy/5 rounded-xl shadow-premium p-6 md:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Services Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-navy">Choose a Service</h3>
              <p className="text-xs text-navy/50 mt-1">Select the dermatological or aesthetic treatment you wish to book.</p>
            </div>

            {servicesLoading ? (
              <Loading />
            ) : (
              <div className="space-y-3">
                {services.map((service, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setErrorMsg('');
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${
                      selectedService?.name === service.name
                        ? 'border-teal bg-teal/5 shadow-glow'
                        : 'border-gray-200 hover:border-teal/30 hover:bg-graybg'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <span className="block text-sm font-bold text-navy">{service.name}</span>
                      <span className="block text-xs text-navy/60 font-light leading-normal">{service.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-sm font-extrabold text-navy">{formatCurrency(service.fee)}</span>
                      <span className="block text-[10px] text-navy/40 font-semibold uppercase mt-0.5">{service.duration} mins</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!selectedService}
                className="bg-navy text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-light font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1.5 transition-colors"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Picker */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-navy">Select Date & Time</h3>
              <p className="text-xs text-navy/50 mt-1">Pick a date within the next 30 days to see available 30-minute slots.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Appointment Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={getMinDate()}
                    max={getMaxDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none bg-white text-navy font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Time Slots Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Available Slots</label>
                
                {!selectedDate ? (
                  <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center text-xs text-navy/40 font-medium">
                    Please select a date to view slots.
                  </div>
                ) : slotsLoading ? (
                  <div className="py-8"><Loading /></div>
                ) : slotStatusInfo?.isClosed ? (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-center text-xs font-medium">
                    Closed. Dr. Ali Ahmed does not consult on this day of the week.
                  </div>
                ) : slotStatusInfo?.isHoliday ? (
                  <div className="bg-amber-50 border border-amber-100 text-amber-600 rounded-lg p-4 text-center text-xs font-medium">
                    Clinic Holiday. Dr. Ali Ahmed is unavailable on this date.
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-4 text-center text-xs font-medium">
                    Fully Booked. No slots available for this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 text-xs font-bold rounded-md border text-center transition-all ${
                          selectedTime === slot
                            ? 'bg-teal border-teal text-navy shadow-glow font-extrabold'
                            : 'border-gray-200 text-navy hover:border-teal/50 hover:bg-teal/5'
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="border border-gray-300 text-navy/70 hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1.5 transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTime}
                className="bg-navy text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-light font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1.5 transition-colors"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Information Form */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-navy">Enter Details</h3>
              <p className="text-xs text-navy/50 mt-1">Provide your name and active WhatsApp phone number for confirmations.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sara Ahmed"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +923001234567"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. client@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">Appointment Notes (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. I have sensitive skin / facial rash, first consultation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 focus:border-teal rounded-lg p-3 text-sm focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Selected Booking Info Summary */}
            <div className="bg-graybg p-4 rounded-lg border border-navy/5 flex justify-between items-center text-xs">
              <div>
                <span className="block text-navy/40 font-bold uppercase">Selected Slot</span>
                <span className="font-semibold text-navy mt-0.5 block">{selectedService?.name}</span>
                <span className="text-teal-dark font-medium block mt-0.5">{formatDate(selectedDate)} at {formatTime(selectedTime)}</span>
              </div>
              <div className="text-right">
                <span className="block text-navy/40 font-bold uppercase">Fee</span>
                <span className="text-sm font-extrabold text-navy mt-0.5 block">{formatCurrency(selectedService?.fee)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="border border-gray-300 text-navy/70 hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1.5 transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-teal hover:bg-teal-dark text-navy font-bold px-8 py-3 rounded-lg text-sm transition-all duration-300 shadow-glow flex items-center space-x-2 animate-pulse-glow"
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
