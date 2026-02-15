import React from 'react';

const Badge = ({ children, status }) => {
  const getColors = () => {
    switch (status?.toLowerCase()) {
      case 'filed':
      case 'registered':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'investigating':
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'trial':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed':
      case 'approved':
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected':
      case 'danger':
      case 'suspended':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getColors()}`}>
      {children}
    </span>
  );
};

export default Badge;
