"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { getLatestStatus, updateGrowlightStatus } from "../component/firebaseService";

// Import komponen
import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";
import MonitoringCard from "../component/MonitoringCard";
import ControlToggle from "../component/ControlToggle";
import StatusAlert from "../component/StatusAlert";

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
  // State untuk waktu saat ini
  const [currentTime, setCurrentTime] = useState('');
  // State untuk status dan waktu perubahan terakhir
  const [statusList, setStatusList] = useState([
    {
      id: Date.now(),
      title: "Selamat Datang",
      message: "Sistem monitoring hidroponik aktif",
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  ]);

  // Effect untuk update waktu secara real-time
  useEffect(() => {
    // Fungsi untuk mengupdate waktu
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    // Update waktu pertama kali
    updateTime();

    // Set interval untuk update waktu setiap detik
    const timeInterval = setInterval(updateTime, 1000);

    // Cleanup interval saat komponen unmount
    return () => clearInterval(timeInterval);
  }, []);

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
          
          // Check jika cahaya berubah signifikan
          if (latestData.cahaya < 2400 && !kontrolData.growlight) {
            handleStatusChange("Cahaya Kurang", "Growlight Dihidupkan");
            // Otomatis aktifkan growlight
            updateGrowlightStatus(true);
            setKontrolData(prev => ({
              ...prev,
              growlight: true
            }));
          } else if (latestData.cahaya > 2400 && kontrolData.growlight) {
            handleStatusChange("Cahaya Cukup", "Growlight Dinonaktifkan");
            // Otomatis nonaktifkan growlight
            updateGrowlightStatus(false);
            setKontrolData(prev => ({
              ...prev,
              growlight: false
            }));
          }
          
          // Check jika level air berubah signifikan
          if (latestData.levelAirCm < 5) {
            handleStatusChange("Level Air Rendah", "Perlu Pengisian Air");
          }
        } else if (type === "kontrol") {
          setKontrolData(latestData);
        }
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    return () => unsubscribe();
  }, [kontrolData.growlight]);

  // Fungsi untuk update status dengan waktu perubahan
  const handleStatusChange = (title, message) => {
    const statusTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Buat status baru
    const newStatus = {
      id: Date.now(), // Unique ID berdasarkan timestamp
      title,
      message,
      time: statusTime
    };
    
    // Update list status (maksimal 3 item, hapus yang paling lama)
    setStatusList(prevList => {
      const newList = [newStatus, ...prevList];
      if (newList.length > 3) {
        return newList.slice(0, 3);
      }
      return newList;
    });
  };

  // Render loading screen jika masih loading
  if (loading) {
    return <LoadingScreen progress={progress} />;
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
        <Header />

        {/* Main Container */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          {/* Monitoring Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Time */}
            <MonitoringCard 
              icon="/icon/icon-park-solid_time.png" 
              value={currentTime}
              className="animate-fadeIn animation-delay-100"
            />

            {/* Light */}
            <MonitoringCard 
              icon="/icon/flowbite_sun-solid.png" 
              value={Math.round(sensorData.cahaya) || 0} 
              unit="Lux"
              className="animate-fadeIn animation-delay-200"
            />

            {/* Temperature */}
            <MonitoringCard 
              icon="/icon/ri_temp-cold-fill.png" 
              value={Math.round(sensorData.suhu) || 0} 
              unit="° C"
              className="animate-fadeIn animation-delay-300"
            />

            {/* Water Level */}
            <MonitoringCard 
              icon="/icon/icon-park-solid_water-level.png" 
              value={sensorData.levelAirCm || 0} 
              unit="cm"
              className="animate-fadeIn animation-delay-400"
            />
          </div>

          {/* Growlight Control */}
          <div className="mb-4 animate-slideUp animation-delay-500">
            <ControlToggle 
              icon="/icon/icon-park-solid_dome-light.png"
              title="Lampu Growlight"
              isActive={kontrolData.growlight}
            />
          </div>

          {/* Pompa Control */}
          <div className="animate-slideUp animation-delay-600">
            <ControlToggle 
              icon="/icon/mdi_pipe-valve.png"
              title="Pompa Peristaltik"
              isActive={sensorData.pompaOn}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="animate-fadeIn animation-delay-700">
          <StatusAlert statusList={statusList} />
        </div>
      </div>
    </Transition>
  );
} 