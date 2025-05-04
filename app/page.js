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
import EditPopup from "./component/EditPopup";
import ToastNotification, { showToast } from "./component/ToastNotification";
import { getLatestStatus, updateGrowlightStatus, updateGrowthValue } from "./component/firebaseService";

export default function Home() {
  const [data, setData] = useState({
    lux: 0,
    tinggi_air: 0,
    pertumbuhan: 0,
  });
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocId, setCurrentDocId] = useState("");
  const [growlightStatus, setGrowlightStatus] = useState(false);
  const [peristalticStatus, setPeristalticStatus] = useState(false);
  
  // State untuk popup edit pertumbuhan
  const [showModal, setShowModal] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // Cek wifi
    if (!navigator.onLine) {
      setConnectionError("Koneksi internet terputus. Silakan periksa koneksi Anda.");
      setIsLoading(false);
      return;
    }

    // Buat listener
    const unsubscribe = getLatestStatus(
      (docId, latestData) => {
        console.log("Data terbaru diterima:", latestData);
        
        if (latestData.pertumbuhan === undefined || latestData.pertumbuhan === null) {
          latestData.pertumbuhan = 0;
        }
        
        setCurrentDocId(docId);
        setData(latestData);
        setConnectionError(null);
        
        // Untuk nentuin status growlight berdasarkan lux
        if (typeof latestData.lux === "number") {
          const shouldBeOn = latestData.lux < 6000;
          const manualOverride = latestData.manual_growlight;
          
          // Untuk switch manual
          if (manualOverride !== undefined) {
            setGrowlightStatus(manualOverride);
          } else {
            setGrowlightStatus(shouldBeOn);
          }
        }
        
        // Cek ketinggian air
        if (typeof latestData.tinggi_air === "number") {
          const shouldActivatePeristaltic = latestData.tinggi_air < 8;
          
          // Jika status peristaltic berubah, tampilkan notifikasi toastify
          if (shouldActivatePeristaltic !== peristalticStatus) {
            if (shouldActivatePeristaltic) {
              showToast.info("Pipa peristaltik dihidupkan karena ketinggian air kurang dari 8 cm");
            } else {
              showToast.info("Pipa peristaltik dimatikan");
            }
            setPeristalticStatus(shouldActivatePeristaltic);
          }
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Error mendapatkan data:", error);
        setConnectionError(error);
        setIsLoading(false);
      }
    );

    return () => {
      console.log("Unsubscribing from Firestore listener");
      unsubscribe();
    };
  }, []); 

  // Logika status cahaya
  let statusCahaya = isLoading ? "Memuat..." : "Data tidak tersedia";

  if (typeof data.lux === "number") {
    if (data.lux < 6000) {
      statusCahaya = "Cahaya Matahari Tidak Mencukupi";
    } else {
      statusCahaya = "Cahaya Matahari Cukup";
    }
  }

  // Fungsi untuk toggle status growlight
  const toggleGrowlight = async (event) => {
    try {
      if (!currentDocId) {
        setConnectionError("Tidak dapat mengubah status, ID dokumen tidak tersedia.");
        return;
      }

      const newStatus = event.target.checked;

      setGrowlightStatus(newStatus);
      
      // Nampilin notifikasi toast
      if (newStatus) {
        showToast.success("Growlight dihidupkan");
      } else {
        showToast.warning("Growlight dimatikan");
      }

      // Update DB di firestore
      await updateGrowlightStatus(currentDocId, newStatus);
      console.log("Status growlight berhasil diperbarui:", newStatus);
    } catch (error) {
      console.error("Error mengubah status growlight:", error);
      setConnectionError(`Error mengubah status: ${error.message}`);
      setGrowlightStatus(!event.target.checked); 
      showToast.error(`Error: ${error.message}`);
    }
  };

  // Fungsi untuk popup edit pertumbuhan tanaman
  const openEditModal = () => {
    const currentGrowth = data.pertumbuhan !== undefined && data.pertumbuhan !== null 
      ? data.pertumbuhan 
      : 0;
    
    setEditValue(String(currentGrowth));
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleSaveGrowth = async () => {
    try {
      if (!currentDocId) {
        setConnectionError("Tidak dapat mengubah data, ID dokumen tidak tersedia.");
        return;
      }

      // Konversi ke number
      const numericValue = parseFloat(editValue);
      
      // Validasi nilai
      if (isNaN(numericValue)) {
        setConnectionError("Nilai harus berupa angka.");
        showToast.error("Nilai harus berupa angka");
        return;
      }

      // Update DB di Firestore
      await updateGrowthValue(currentDocId, numericValue);
      console.log("Nilai pertumbuhan berhasil diperbarui:", numericValue);
      
      // Notifikasi sukses
      showToast.success(`Ukuran tanaman diperbarui: ${numericValue} cm`);

      // Tutup popup
      setShowModal(false);
    } catch (error) {
      console.error("Error mengubah nilai pertumbuhan:", error);
      setConnectionError(`Error mengubah data: ${error.message}`);
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

      {/* Main Container */}
      <div className="w-full bg-white rounded-t-[32px] -mt-6 h-auto overflow-hidden">
        {/* Connection Error Banner */}
        {connectionError && (
          <ErrorBanner 
            message={connectionError} 
            onRetry={() => window.location.reload()} 
          />
        )}

        {/* Card Status */}
        <div className="w-full px-5 sm:px-7 pt-7 pb-8 space-y-4">
          {/* 1. Status Cahaya */}
          <StatusCard 
            bgColor="bg-[#FFA75C]"
            icon={<SunIcon className="h-8 w-8 text-white" />}
            title="Cahaya"
            value={statusCahaya}
          />

          {/* 2. Status Growlight*/}
          <StatusCard 
            bgColor="bg-[#B5ABF8]"
            icon={<LightBulbIcon className="h-8 w-8 text-white" />}
            title="Growlight"
            value={growlightStatus ? "ON" : "OFF"}
            hasSwitch={true}
            switchChecked={growlightStatus}
            onSwitchChange={toggleGrowlight}
            isLoading={isLoading}
          />

          {/* 3. Status Ketinggian Air */}
          <StatusCard 
            bgColor="bg-[#597D94]"
            icon={<BeakerIcon className="h-8 w-8 text-white" />}
            title="Ketinggian Air"
            value={data.tinggi_air !== undefined && !isNaN(data.tinggi_air)
              ? `${data.tinggi_air} cm`
              : isLoading
              ? "Memuat..."
              : "Data tidak tersedia"}
          />

          {/* 4. Status Peristaltic*/}
          <StatusCard 
            bgColor="bg-[#5EA3D0]"
            icon={<FontAwesomeIcon icon={faWater} className="h-8 w-8 text-white" />}
            title="Pipa Peristaltik"
            value={peristalticStatus ? "ON" : "OFF"}
          />

          {/* 5. Status Pertumbuhan Tanaman*/}
          <StatusCard 
            bgColor="bg-[#B5E29B]"
            icon={<FontAwesomeIcon icon={faSeedling} className="h-8 w-8 text-white" />}
            title="Pertumbuhan Tanaman"
            value={`Ukuran Tanaman: ${data.pertumbuhan !== undefined && data.pertumbuhan !== null 
              ? data.pertumbuhan 
              : 0} cm`}
            hasEditButton={true}
            onEditClick={openEditModal}
            isLoading={isLoading}
          />
        </div>

        <EditPopup 
          show={showModal}
          value={editValue}
          onChange={handleEditChange}
          onClose={() => setShowModal(false)}
          onSave={handleSaveGrowth}
          title="Edit Ukuran Tanaman"
          fieldLabel="Ukuran Tanaman (cm)"
        />
        
        <ToastNotification />
      </div>
    </div>
  );
}