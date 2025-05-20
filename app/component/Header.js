"use client";

import React from 'react';

const Header = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-center">
      <img src="/icon/mdi_leaf.png" alt="Logo" className="w-6 h-6 mr-2" />
      <h1 className="text-[#46AE5F] font-medium">Hidroponic Monitoring</h1>
    </div>
  );
};

export default Header; 