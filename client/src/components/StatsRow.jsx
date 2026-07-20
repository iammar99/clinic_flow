import React from 'react';
import { Calendar, Users, ClipboardCheck, Clock } from 'lucide-react';

const StatsRow = ({ stats }) => {
  const items = [
    {
      label: "Today's Consults",
      value: stats?.todayCount ?? 0,
      icon: Calendar,
      color: 'text-teal',
      bg: 'bg-teal/10',
      trend: "Scheduled today"
    },
    {
      label: "Tomorrow's Plan",
      value: stats?.tomorrowCount ?? 0,
      icon: Clock,
      color: 'text-gold',
      bg: 'bg-gold/10',
      trend: "Upcoming tomorrow"
    },
    {
      label: "Total Patients",
      value: stats?.totalPatients ?? 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      trend: "Registered records"
    },
    {
      label: "Pending Confirmations",
      value: stats?.pendingCount ?? 0,
      icon: ClipboardCheck,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      trend: "Action required"
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-premium overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-100 flex flex-col md:flex-row w-full shrink-0">
      {items.map((item, idx) => (
        <div key={idx} className="flex-1 flex items-center justify-between p-6">
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-navy/40 uppercase tracking-wider">
              {item.label}
            </span>
            <span className="block text-2xl md:text-3xl font-extrabold text-navy leading-none">
              {item.value}
            </span>
            <span className="block text-[10px] text-navy/55 font-medium leading-none">
              {item.trend}
            </span>
          </div>
          <div className={`p-3 rounded-lg ${item.bg} ${item.color} shrink-0`}>
            <item.icon size={22} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
