"use client";

import React from 'react';

const MonitoringCard = ({ icon, value, unit = '' }) => {
  return (
    <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
      <img src={icon} alt="Icon" className="w-12 h-12 mb-4" />
      <p className="text-lg font-semibold text-[#102E50]">{value} {unit}</p>
    </div>
  );
};

export default MonitoringCard; 