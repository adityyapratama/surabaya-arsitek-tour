# Surabaya Arsitektur Tour 🏛️

Aplikasi web interaktif untuk penjelajahan destinasi, *booking* tiket, dan paket tur wisata arsitektur bersejarah di Surabaya. Menampilkan berbagai bangunan ikonik dari era kolonial Belanda hingga *Art Deco*.

## 🛠️ Teknologi yang Digunakan
- **Frontend**: HTML5, CSS3 (Native), Vanilla JavaScript
- **Backend API**: Node.js, Express.js
- **Database**: MySQL 8.0 (dijalankan di dalam Docker Container)

## 📁 Struktur Folder

Proyek ini menggunakan pemisahan *frontend* dan *backend* (*Separation of Concerns*):
```text
webTalitha/
├── backend/
│   ├── server.js              # Server Backend API Node.js/Express
│   ├── init.sql               # Script inisiasi dan seeding MariaDB/MySQL
│   ├── docker-compose.yml     # Konfigurasi Container Docker
│   └── .env                   # Environment variable database
├── css/
│   └── style.css              # File styling antar muka
├── js/
│   ├── main.js                # Core logic Frontend & HTTP Fetch
│   └── data.js                # [Arsip] Data dummy original sebelum database
├── scripts/
│   └── (File arsip / dokumentasi riwayat pengembangan)
├── index.html                 # Halaman utama Website (Frontend)
└── package.json               # Konfigurasi library Node.js
```

---

## 🚀 Cara Menjalankan Project

Untuk menjalankan aplikasi ini secara fungsional di lokal perangkat Anda, terapkan **3 langkah** berikut:

### 1. Persiapan Database (Docker)
Pastikan aplikasi **Docker Desktop** sudah berjalan.
Buka *Terminal* dan masuk ke folder `backend`, lalu jalankan *container*:
```bash
cd backend
docker-compose up -d
```
*Note: Docker dan `init.sql` akan otomatis membuat database `wisata_arsitektur_sby` pada port 3307 beserta isi data destinasinya.*

### 2. Jalankan API Server Backend
Buka terminal baru dan pastikan Anda berada di direktori ruang kerja utama (`webTalitha/`). Instal dependensi jika belum ada, lalu jalankan server node:
```bash
npm install
node backend/server.js
```
*Jika berhasil, Backend server akan berjalan. Terdapat konfirmasi di console: `Server berjalan di http://localhost:3000`.*

### 3. Jalankan Aplikasi Web (Frontend)
Web ini perlu dijalankan menggunakan web server lokal untuk menjalankan fungsi `fetch()` API dengan benar dan terhindar dari *CORS block*. Pilih salah satu metode di bawah ini:

**Cara Termudah (VS Code Live Server):**
1. Buka file `index.html` di dalam VS Code.
2. Klik Kanan, lalu pilih opsi **"Open with Live Server"**.
3. Browser akan otomatis terbuka (biasanya di `http://127.0.0.1:5500/`).

**Cara via Terminal (menggunakan npx):**
Buka terminal baru dan jalankan:
```bash
npx serve .
```
Klik tautan *Local* yang diberikan di terminal tersebut (misalnya `http://localhost:64202/` atau tautan lainnya).

---

## 💡 Interaksi Website
1. **Explore:** Menampilkan data bangunan yang diambil via API dari MySQL.
2. **Wishlist:** Klik icon hati (♡) pada tiap lokasi untuk menyimpannya di browser.
3. **Tiket / Keranjang:** Anda dapat mensimulasikan penambahan tiket masuk atau paket tur ke dalam *cart*, dan melakukan 'Checkout'.

🎯 *Dibuat untuk melestarikan apresiasi sejarah arsitektur di Kota Pahlawan.*