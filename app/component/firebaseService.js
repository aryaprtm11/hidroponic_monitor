import { 
    ref,
    onValue,
    update,
    child,
    push,
    set,
    get
} from "firebase/database";
import { db } from "../firebaseConfig"; // Mengimpor db dari config
  
/**
 * Mendapatkan data status terbaru dari Realtime Database secara real-time
 * @param {Function} callback - Fungsi data baru tersedia
 * @param {Function} errorCallback - Fungsi kalau terjadi error
 * @returns {Function} - Fungsi untuk membersihkan listener
 */

export const getLatestStatus = (callback, errorCallback) => {
    try {
        // Referensi ke node "sensor" dan "kontrol"
        const sensorRef = ref(db, "sensor");
        const kontrolRef = ref(db, "kontrol");
        
        // Gunakan onValue untuk mendapatkan snapshot sensor
        const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
            if (snapshot.exists()) {
                const sensorData = snapshot.val();
                callback("sensor", sensorData);
            }
        }, (error) => {
            console.error("Error listening to sensor snapshot:", error);
            errorCallback(`Error: ${error.message}`);
        });

        // Gunakan onValue untuk mendapatkan snapshot kontrol
        const unsubscribeKontrol = onValue(kontrolRef, (snapshot) => {
            if (snapshot.exists()) {
                const kontrolData = snapshot.val();
                callback("kontrol", kontrolData);
            }
        }, (error) => {
            console.error("Error listening to kontrol snapshot:", error);
            errorCallback(`Error: ${error.message}`);
        });
        
        return () => {
            unsubscribeSensor();
            unsubscribeKontrol();
        };
    } catch (error) {
        console.error("Error setting up snapshot listener:", error);
        errorCallback(`Error: ${error.message}`);
        return () => {};
    }
};

/**
 * Menginisialisasi data default jika belum ada
 */
export const initializeDefaultData = async () => {
    try {
        const sensorRef = ref(db, "sensor");
        const kontrolRef = ref(db, "kontrol");
        
        // Cek dulu apakah data sudah ada
        const sensorSnapshot = await get(sensorRef);
        const kontrolSnapshot = await get(kontrolRef);

        if (!sensorSnapshot.exists()) {
            // Siapkan data awal sensor
            const initialSensorData = {
                cahaya: 0,
                growlightOn: false,
                levelAir: 0,
                levelAirCm: 0,
                pompaOn: false,
                suhu: 0
            };
            
            await set(sensorRef, initialSensorData);
        }

        if (!kontrolSnapshot.exists()) {
            // Siapkan data awal kontrol
            const initialKontrolData = {
                growlight: true
            };
            
            await set(kontrolRef, initialKontrolData);
        }

        console.log("Data awal berhasil dibuat");
    } catch (error) {
        console.error("Error membuat data awal:", error);
    }
};
  
/**
 * Memperbarui status growlight di Realtime Database
 * @param {string} docId - ID dokumen yang akan diperbarui
 * @param {boolean} status - Status baru untuk growlight
 * @returns {Promise} - Promise yang diselesaikan ketika update selesai
 */

export const updateGrowlightStatus = async (status) => {
    try {
        const kontrolRef = ref(db, "kontrol");
        const updates = {
            growlight: status
        };
        
        return update(kontrolRef, updates);
    } catch (error) {
        console.error("Error updating growlight status:", error);
        throw error;
    }
};

/**
 * Memperbarui nilai pertumbuhan tanaman di Realtime Database
 * @param {string} docId - ID dokumen yang akan diperbarui
 * @param {number} value - Nilai pertumbuhan baru
 * @returns {Promise} - Promise yang diselesaikan ketika update selesai
 */

export const updateGrowthValue = async (docId, value) => {
    try {
        const statusRef = ref(db, "status");
        const updates = {
            pertumbuhan: value,
            waktu: Date.now() // Timestamp untuk Realtime Database
        };
        
        return update(statusRef, updates);
    } catch (error) {
        console.error("Error updating growth value:", error);
        throw error;
    }
};