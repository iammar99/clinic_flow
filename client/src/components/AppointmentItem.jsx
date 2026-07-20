import React from 'react';
import { Check, X, FileText, CheckCircle } from 'lucide-react';
import { formatTime, getStatusColor } from '../utils/helpers';

const AppointmentItem = ({ appointment, onStatusChange, onViewNotes }) => {
  const { id, time, serviceName, status, notes, patient } = appointment;

  return (
    <div className="flex items-center group py-4 border-b border-gray-100 hover:bg-graybg/45 px-2 transition-all">
      {/* Time column */}
      <div className="w-24 shrink-0">
        <span className="font-extrabold text-sm text-navy block">
          {formatTime(time)}
        </span>
      </div>

      {/* Timeline Divider */}
      <div className="hidden sm:flex items-center text-navy/20 px-2 shrink-0 select-none">
        ──
      </div>

      {/* Patient info */}
      <div className="flex-1 min-w-0 pr-4">
        <span className="block font-bold text-sm text-navy truncate">
          {patient?.name || 'Unknown Patient'}
        </span>
        <span className="block text-[11px] text-navy/40 font-medium truncate mt-0.5">
          {patient?.phone}
        </span>
      </div>

      {/* Timeline Divider */}
      <div className="hidden sm:flex items-center text-navy/20 px-2 shrink-0 select-none">
        ──
      </div>

      {/* Service info */}
      <div className="flex-1 min-w-0 pr-4 hidden md:block">
        <span className="block font-semibold text-sm text-navy truncate">
          {serviceName}
        </span>
      </div>

      {/* Notes icon (if notes exist) */}
      <div className="shrink-0 mr-4">
        {notes ? (
          <button 
            onClick={() => onViewNotes(appointment)}
            className="text-navy/40 hover:text-teal p-1.5 rounded transition-colors"
            title="Read Appointment Notes"
          >
            <FileText size={16} />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Status Badge */}
      <div className="shrink-0 w-24 mr-4 text-center">
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1.5 shrink-0">
        {status === 'pending' && (
          <>
            <button
              onClick={() => onStatusChange(id, 'confirmed')}
              className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Confirm Appointment"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => onStatusChange(id, 'cancelled')}
              className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Cancel Appointment"
            >
              <X size={14} />
            </button>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <button
              onClick={() => onStatusChange(id, 'completed')}
              className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Mark Completed"
            >
              <CheckCircle size={14} />
            </button>
            <button
              onClick={() => onStatusChange(id, 'cancelled')}
              className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Cancel Appointment"
            >
              <X size={14} />
            </button>
          </>
        )}

        {status === 'completed' && (
          <span className="text-[10px] text-navy/40 font-bold px-2 py-1 select-none">
            ✓ Finished
          </span>
        )}

        {status === 'cancelled' && (
          <span className="text-[10px] text-red-400 font-bold px-2 py-1 select-none">
            ✕ Cancelled
          </span>
        )}
      </div>
    </div>
  );
};

export default AppointmentItem;
