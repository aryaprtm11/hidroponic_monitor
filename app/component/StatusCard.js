import React from 'react';

export default function StatusCard({ title, value, isLoading = false }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-lg font-semibold mt-1">
        {isLoading ? 'Memuat...' : value}
      </p>
    </div>
  );
} 