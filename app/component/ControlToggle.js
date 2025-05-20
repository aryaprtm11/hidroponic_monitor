"use client";

import React from 'react';

const ControlToggle = ({ 
  icon, 
  title, 
  isActive, 
  onToggle,
  isLoading = false
}) => {
  return (
    <div className="bg-[#f6f6f6] rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src={icon} alt={title} className="w-8 h-8 mr-3" />
        <div>
          <p className="font-medium text-[#102E50]">{title}</p>
          <p className="text-sm text-[#102E50]">{isActive ? "Diaktifkan" : "Nonaktifkan"}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
          disabled={isLoading}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
      </label>
    </div>
  );
};

export default ControlToggle; 