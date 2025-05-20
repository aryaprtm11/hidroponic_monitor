"use client";

import React from 'react';
import { Transition } from "@headlessui/react";

const StatusAlert = ({ statusList = [] }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-[#102E50]">Status</h2>
      
      <div className="space-y-2">
        {statusList.map((status, index) => (
          <Transition
            key={`${status.time}-${index}`}
            show={true}
            appear={true}
            enter="transition-all duration-300 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-300 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center">
              <img src="/icon/solar_bell-bold-duotone.png" alt="Alert" className="w-10 h-10 mr-4" />
              <div>
                <p className="font-medium text-[#102E50]">{status.title}</p>
                <p className="font-medium text-[#102E50]">{status.message}</p>
                <div className="flex items-center text-sm text-[#102E50] mt-1">
                  <img src="/icon/icon-park-solid_time.png" alt="Time" className="w-4 h-4 mr-1" />
                  <span>{status.time}</span>
                </div>
              </div>
            </div>
          </Transition>
        ))}
        
        {statusList.length === 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center">
            <div className="w-full text-center text-gray-500">
              Belum ada status terbaru
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusAlert; 