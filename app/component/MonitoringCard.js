"use client";

import React from 'react';

const MonitoringCard = ({ icon, value, unit = '' }) => {
  return (
    <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
      <img src={icon} alt="Icon" className="w-8 h-8 mb-1" />
      <p className="text-lg font-semibold text-[#102E50]">{value} {unit}</p>
    </div>
  );
};

export default MonitoringCard; 