"use client";

import React from 'react';

const LoadingScreen = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-6">
        <img 
          src="/icon/mdi_leaf.png" 
          alt="Logo" 
          className="w-20 h-20 animate-bounce"
        />
        <h1 className="text-xl font-medium text-[#46AE5F]">
          Hidroponic Monitoring
        </h1>
        
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#46AE5F] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500">
          Loading... {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 