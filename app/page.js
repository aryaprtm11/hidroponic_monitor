"use client";

import { useState, useEffect } from "react";
import {
  SunIcon,
  BeakerIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faWater } from "@fortawesome/free-solid-svg-icons";
import StatusCard from "./component/card";
import ErrorBanner from "./component/ErrorBanner";
import ToastNotification, { showToast } from "./component/ToastNotification";
import { getLatestStatus, updateGrowlightStatus } from "./component/firebaseService";

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

  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek wifi
    if (!navigator.onLine) {
      setConnectionError("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      setIsLoading(false);
      return;
    }

    // Listener Firebase
    const unsubscribe = getLatestStatus(
      (type, latestData) => {
        console.log(`Data ${type} terbaru diterima:`, latestData);

        if (type === "sensor") {
          setSensorData(latestData);
        } else if (type === "kontrol") {
          setKontrolData(latestData);
        }

        setConnectionError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error mendapatkan data:", error);
        setConnectionError(error);
        setIsLoading(false);
      }
    );

    return () => {
      console.log("Unsubscribing from Firebase listener");
      unsubscribe();
    };
  }, []);

  // Logika status cahaya
  let statusCahaya = isLoading ? "Memuat..." : "Data tidak tersedia";

  if (typeof sensorData.cahaya === "number") {
    if (sensorData.cahaya < 6000) {
      statusCahaya = "Cahaya Matahari Tidak Mencukupi";
    } else {
      statusCahaya = "Cahaya Matahari Cukup";
    }
  }

  // Fungsi untuk toggle status growlight
  const toggleGrowlight = async (event) => {
    try {
      const newStatus = event.target.checked;
      
      // Update state lokal
      setKontrolData(prev => ({
        ...prev,
        growlight: newStatus
      }));

      // Nampilin notifikasi toast
      if (newStatus) {
        showToast.success("Growlight dihidupkan");
      } else {
        showToast.warning("Growlight dimatikan");
      }

      // Update DB di Firebase
      await updateGrowlightStatus(newStatus);
      console.log("Status growlight berhasil diperbarui:", newStatus);
    } catch (error) {
      console.error("Error mengubah status growlight:", error);
      setConnectionError(`Error mengubah status: ${error.message}`);
      setKontrolData(prev => ({
        ...prev,
        growlight: !event.target.checked
      }));
      showToast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center w-full overflow-hidden">
      <div className="w-full">
        <img
          src="/dashboard_image.png"
          alt="Ilustrasi Hidroponik"
          className="w-full h-auto object-cover"
          draggable={false}
        />
      </div>

      <div className="w-full bg-white rounded-t-[32px] -mt-6 h-auto overflow-hidden">
        {connectionError && (
          <ErrorBanner 
            message={connectionError} 
            onRetry={() => window.location.reload()} 
          />
        )}

        <div className="w-full px-5 sm:px-7 pt-7 pb-8 space-y-4">
          <StatusCard 
            bgColor="bg-[#FFA75C]"
            icon={<SunIcon className="h-8 w-8 text-white" />}
            title="Cahaya"
            value={statusCahaya}
          />

          <StatusCard 
            bgColor="bg-[#B5ABF8]"
            icon={<LightBulbIcon className="h-8 w-8 text-white" />}
            title="Growlight"
            value={sensorData.growlightOn ? "ON" : "OFF"}
            hasSwitch={true}
            switchChecked={kontrolData.growlight}
            onSwitchChange={toggleGrowlight}
            isLoading={isLoading}
          />

          <StatusCard
            bgColor="bg-[#59C9D9]"
            icon={<FontAwesomeIcon icon={faWater} className="h-8 w-8 text-white" />}
            title="Suhu Air"
            value={sensorData.suhu !== undefined && !isNaN(sensorData.suhu) 
              ? `${sensorData.suhu}°C` 
              : isLoading
              ? "Memuat..." 
              : "Data tidak tersedia"}
            isLoading={isLoading}
          />

          <StatusCard 
            bgColor="bg-[#597D94]"
            icon={<BeakerIcon className="h-8 w-8 text-white" />}
            title="Ketinggian Air"
            value={sensorData.levelAirCm !== undefined && !isNaN(sensorData.levelAirCm)
              ? `${sensorData.levelAirCm} cm`
              : isLoading
              ? "Memuat..."
              : "Data tidak tersedia"}
          />

          <StatusCard 
            bgColor="bg-[#5EA3D0]"
            icon={<FontAwesomeIcon icon={faWater} className="h-8 w-8 text-white" />}
            title="Pipa Peristaltik"
            value={sensorData.pompaOn ? "ON" : "OFF"}
          />
        </div>
        
        <ToastNotification />
      </div>
    </div>
  );
}