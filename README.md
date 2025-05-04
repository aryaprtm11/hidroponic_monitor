# Dokumentasi Sistem Monitoring Hidroponik

## Deskripsi

Sistem Monitoring Hidroponik adalah aplikasi berbasis web yang memungkinkan pengguna untuk memantau kondisi tanaman hidroponik secara real-time. Aplikasi ini menggunakan Firebase Realtime Database untuk menyimpan dan mengambil data sensor dari sistem hidroponik.

## Fitur Utama

- Monitoring cahaya matahari
- Kontrol growlight otomatis dan manual
- Monitoring ketinggian air
- Status pipa peristaltik otomatis
- Pengukuran pertumbuhan tanaman
- Notifikasi real-time

## Cara Penggunaan

### Prasyarat

Sebelum menggunakan aplikasi ini, pastikan Anda telah:

1. Mengatur perangkat sensor pada sistem hidroponik Anda
2. Mengonfigurasi Firebase Realtime Database
3. Memiliki koneksi internet yang stabil

### Instalasi

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://github.com/aryaprtm11/hidroponic_monitor
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd sistem-monitoring-hidroponik
   ```

3. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```

4. Buat file `firebaseConfig.js` di direktori root dengan konfigurasi Firebase Anda:
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```

5. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

### Mengakses Dashboard

Buka browser dan akses `http://localhost:3000` untuk melihat dashboard monitoring hidroponik.

## Menggunakan Dashboard

### 1. Monitoring Cahaya

- Panel ini menampilkan status cahaya matahari saat ini
- Status "Cahaya Matahari Cukup" berarti intensitas cahaya di atas 6000 lux
- Status "Cahaya Matahari Tidak Mencukupi" berarti intensitas cahaya di bawah 6000 lux

### 2. Kontrol Growlight

- Panel ini menampilkan status growlight (lampu tanaman) saat ini
- Anda dapat mengaktifkan atau menonaktifkan growlight secara manual dengan menggeser tombol switch
- Growlight akan otomatis menyala jika intensitas cahaya kurang dari 6000 lux (kecuali diatur manual)

### 3. Monitoring Ketinggian Air

- Panel ini menampilkan ketinggian air dalam tangki hidroponik dalam satuan cm
- Data diperbarui secara real-time dari sensor

### 4. Status Pipa Peristaltik

- Panel ini menampilkan status pipa peristaltik (pompa air)
- Pipa akan otomatis aktif jika ketinggian air kurang dari 8 cm
- Notifikasi akan muncul saat status pipa berubah

### 5. Pertumbuhan Tanaman

- Panel ini menampilkan ukuran tanaman saat ini dalam satuan cm
- Klik tombol edit (ikon pensil) untuk memperbarui ukuran tanaman secara manual
- Masukkan nilai baru dan klik "Simpan" untuk memperbarui data

## Troubleshooting

### Masalah Koneksi

Jika muncul banner "Masalah Koneksi", periksa:
- Koneksi internet Anda
- Konfigurasi Firebase Anda
- Klik tombol "Coba Lagi" untuk memuat ulang aplikasi

### Data Tidak Diperbarui

Jika data tidak diperbarui secara real-time:
1. Pastikan sensor terhubung dengan benar
2. Periksa struktur data di Firebase Realtime Database
3. Pastikan dokumen memiliki field `waktu` dengan nilai timestamp

## Struktur Data Firebase

Aplikasi ini mengharapkan struktur data berikut di koleksi "status" Firestore:

```
status/
  ├── [document_id]/
  │     ├── lux: number
  │     ├── tinggi_air: number
  │     ├── pertumbuhan: number
  │     ├── manual_growlight: boolean (opsional)
  │     └── waktu: timestamp
```