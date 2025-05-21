"use client";

import React from 'react';

const ControlToggle = ({ 
  icon, 
  title, 
  isActive
}) => {
  return (
    <div className="bg-[#f6f6f6] rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src={icon} alt={title} className="w-8 h-8 mr-3" />
        <div>
          <p className="font-medium text-[#102E50]">{title}</p>
          <p className="text-sm text-[#102E50]">{isActive ? "Aktif" : "Nonaktif"}</p>
        </div>
      </div>
    </div>
  );
};

export default ControlToggle; 