import React from 'react';
import { User, Phone, Mail, Calendar, Eye, FileSpreadsheet } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PatientItem = ({ patient, onViewDetail }) => {
  const { id, name, phone, email, totalVisits, lastVisit } = patient;

  return (
    <tr className="hover:bg-graybg/40 transition-colors border-b border-gray-100">
      
      {/* Name and Phone */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-navy/5 text-navy flex items-center justify-center font-bold text-sm shrink-0 border border-navy/5">
            {name?.charAt(0) || 'P'}
          </div>
          <div className="ml-3.5 min-w-0">
            <span className="block text-sm font-bold text-navy truncate">
              {name}
            </span>
            <span className="block text-[11px] text-navy/40 font-medium truncate mt-0.5">
              {phone}
            </span>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-navy/70">
        {email || <span className="text-navy/30 italic text-xs">No email recorded</span>}
      </td>

      {/* Total Visits */}
      <td className="px-6 py-4.5 whitespace-nowrap text-center text-sm font-bold text-navy">
        {totalVisits}
      </td>

      {/* Last Visit Date */}
      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-navy/70">
        {lastVisit ? (
          <span className="flex items-center space-x-1.5 font-medium">
            <Calendar size={14} className="text-teal shrink-0" />
            <span>{formatDate(lastVisit)}</span>
          </span>
        ) : (
          <span className="text-navy/30 italic text-xs">Never visited</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
        <button
          onClick={() => onViewDetail(id)}
          className="inline-flex items-center space-x-1 bg-navy hover:bg-navy-light text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm"
        >
          <Eye size={12} />
          <span>View History</span>
        </button>
      </td>

    </tr>
  );
};

export default PatientItem;
