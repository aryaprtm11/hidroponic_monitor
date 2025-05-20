"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { getLatestStatus, updateGrowlightStatus } from "../component/firebaseService";

export default function Home() {
  const [sensorData, setSensorData] = useState({
    cahaya: 0,
    growlightOn: false,
    levelAir: 0,
    levelAirCm: 0,
    pompaOn: false,
    suhu: 0
  });

  const [kontrolData, setKontrolData] = useState({
    growlight: true
  });

  const [show, setShow] = useState(false);
  // State untuk loading screen
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Effect untuk loading screen
  useEffect(() => {
    // Reset loading state setiap kali halaman di-refresh
    setLoading(true);
    setProgress(0);
    
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 2;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Setelah loading mencapai 100%, tampilkan konten utama
          setTimeout(() => {
            setLoading(false);
          }, 300);
          return 100;
        }
        return newProgress;
      });
    }, 15);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setShow(true);
    const unsubscribe = getLatestStatus(
      (type, latestData) => {
        if (type === "sensor") {
          setSensorData(latestData);
        } else if (type === "kontrol") {
          setKontrolData(latestData);
        }
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleGrowlight = async (newStatus) => {
    try {
      setKontrolData(prev => ({
        ...prev,
        growlight: newStatus
      }));
      await updateGrowlightStatus(newStatus);
    } catch (error) {
      console.error("Error:", error);
      setKontrolData(prev => ({
        ...prev,
        growlight: !newStatus
      }));
    }
  };

  const togglePompa = async (newStatus) => {
    // Untuk contoh saja, implementasi sebenarnya perlu dibuat
    try {
      setSensorData(prev => ({
        ...prev,
        pompaOn: newStatus
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Render loading screen jika masih loading
  if (loading) {
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
  }

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <div className="min-h-screen bg-[#f6f6f6] p-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-center">
          <img src="/icon/mdi_leaf.png" alt="Logo" className="w-6 h-6 mr-2" />
          <h1 className="text-[#46AE5F] font-medium">Hidroponic Monitoring</h1>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          {/* Monitoring Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Time */}
            <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
              <img src="/icon/icon-park-solid_time.png" alt="Time" className="w-8 h-8 mb-1" />
              <p className="text-lg font-semibold text-[#102E50]">{currentTime}</p>
            </div>

            {/* Light */}
            <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
              <img src="/icon/flowbite_sun-solid.png" alt="Light" className="w-8 h-8 mb-1" />
              <p className="text-lg font-semibold text-[#102E50]">{sensorData.cahaya || 0} Lux</p>
            </div>

            {/* Temperature */}
            <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
              <img src="/icon/ri_temp-cold-fill.png" alt="Temperature" className="w-8 h-8 mb-1" />
              <p className="text-lg font-semibold text-[#102E50]">{sensorData.suhu || 0}° C</p>
            </div>

            {/* Water Level */}
            <div className="bg-[#f6f6f6] rounded-full p-6 flex flex-col items-center justify-center aspect-square">
              <img src="/icon/icon-park-solid_water-level.png" alt="Water" className="w-8 h-8 mb-1" />
              <p className="text-lg font-semibold text-[#102E50]">{sensorData.levelAirCm || 0} cm</p>
            </div>
          </div>

          {/* Growlight Control */}
          <div className="bg-[#f6f6f6] rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/icon/icon-park-solid_dome-light.png" alt="Growlight" className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium text-[#102E50]">Lampu Growlight</p>
                <p className="text-sm text-[#102E50]">{kontrolData.growlight ? "Diaktifkan" : "Nonaktifkan"}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={kontrolData.growlight}
                onChange={(e) => toggleGrowlight(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          {/* Pompa Control */}
          <div className="bg-[#f6f6f6] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/icon/mdi_pipe-valve.png" alt="Pump" className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium text-[#102E50]">Pompa Peristaltik</p>
                <p className="text-sm text-[#102E50]">{sensorData.pompaOn ? "Diaktifkan" : "Nonaktifkan"}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sensorData.pompaOn}
                onChange={(e) => togglePompa(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>
        </div>

        {/* Status Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-[#102E50]">Status</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center">
            <img src="/icon/solar_bell-bold-duotone.png" alt="Alert" className="w-10 h-10 mr-4" />
            <div>
              <p className="font-medium text-[#102E50]">Cahaya Kurang</p>
              <p className="font-medium text-[#102E50]">Growlight Dihidupkan</p>
              <div className="flex items-center text-sm text-[#102E50] mt-1">
                <img src="/icon/icon-park-solid_time.png" alt="Time" className="w-4 h-4 mr-1" />
                <span>12.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
} 