import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    doc, 
    updateDoc,
    serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Mengimpor db dari config
  
/**
 * Mendapatkan data status terbaru dari Firestore secara real-time
 * @param {Function} callback - Fungsi data baru tersedia
 * @param {Function} errorCallback - Fungsi kalau terjadi error
 * @returns {Function} - Fungsi untuk membersihkan listener
 */

export const getLatestStatus = (callback, errorCallback) => {
    try {
        const statusQuery = query(
            collection(db, "status"),
            orderBy("waktu", "desc"),
            limit(1)
        );
    
        return onSnapshot(
            statusQuery,
            (querySnapshot) => {
            if (!querySnapshot.empty) {
                const latestDoc = querySnapshot.docs[0];
                callback(latestDoc.id, latestDoc.data());
            } else {
                errorCallback("Tidak ada data ditemukan dalam database.");
            }
            },
            (error) => {
            console.error("Error listening to snapshot:", error);
            errorCallback(`Error: ${error.message}`);
            }
        );
    } catch (error) {
        console.error("Error setting up snapshot listener:", error);
        errorCallback(`Error: ${error.message}`);
        return () => {};
    }
};
  
/**
 * Memperbarui status growlight di Firestore
 * @param {string} docId - ID dokumen yang akan diperbarui
 * @param {boolean} status - Status baru untuk growlight
 * @returns {Promise} - Promise yang diselesaikan ketika update selesai
 */

export const updateGrowlightStatus = async (docId, status) => {
    try {
        const docRef = doc(db, "status", docId);
        return updateDoc(docRef, {
        manual_growlight: status,
        waktu: serverTimestamp() 
        });
    } catch (error) {
        console.error("Error updating growlight status:", error);
        throw error;
    }
};

/**
 * Memperbarui nilai pertumbuhan tanaman di Firestore
 * @param {string} docId - ID dokumen yang akan diperbarui
 * @param {number} value - Nilai pertumbuhan baru
 * @returns {Promise} - Promise yang diselesaikan ketika update selesai
 */

export const updateGrowthValue = async (docId, value) => {
    try {
        const docRef = doc(db, "status", docId);
        return updateDoc(docRef, {
        pertumbuhan: value,
        waktu: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating growth value:", error);
        throw error;
    }
};