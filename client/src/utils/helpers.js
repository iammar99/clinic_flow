// Format date from YYYY-MM-DD to a more readable format e.g. "Jul 20, 2026"
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format time string from "09:30" to "9:30 AM"
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Get status badge colors
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    case 'pending':
      return 'bg-amber-50 text-amber-600 border border-amber-200';
    case 'completed':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'cancelled':
      return 'bg-red-50 text-red-600 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

// Format currency (PKR)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'PKR 0';
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
};

// Get day of the week from date YYYY-MM-DD
export const getDayOfWeek = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};
