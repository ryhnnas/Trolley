<img width="624" height="384" alt="ecommerce" src="https://github.com/user-attachments/assets/f8e526ca-1954-43ae-b062-3ecba0d572d1" />

# 🛒 Trolley - Platform E-commerce Marketplace

Trolley adalah sebuah platform e-commerce berbasis web yang dibangun menggunakan stack MERN (MySQL, Express.js, React, Node.js). Proyek ini memungkinkan pengguna untuk mendaftar, membeli produk, dan bahkan meng-upgrade akun mereka untuk membuka toko sendiri dan menjual produk mereka.

## ✨ Fitur Utama

Proyek ini mencakup berbagai fungsionalitas inti dari sebuah platform e-commerce modern:

### Sebagai Pembeli:
- **Autentikasi Pengguna:** Registrasi dan Login yang aman.
- **Penjelajahan Produk:** Melihat produk dari berbagai toko dengan filter dan urutan (berdasarkan harga, terbaru, dll).
- **Pencarian:** Mencari produk spesifik menggunakan search bar.
- **Halaman Detail Produk:** Melihat detail lengkap produk, galeri gambar, deskripsi, ulasan, dan info toko.
- **Wishlist:** Menyimpan produk yang disukai.
- **Keranjang Belanja:** Menambah, mengubah kuantitas, dan menghapus produk dari keranjang.
- **Alur Checkout:** Proses checkout lengkap dengan pilihan alamat dan metode pembayaran.
- **Manajemen Akun:** Mengelola profil, alamat, kartu pembayaran, dan melihat riwayat pesanan.
- **Ulasan & Rating:** Memberikan rating dan ulasan untuk produk yang sudah dibeli.

### Sebagai Penjual:
- **Buka Toko:** Alur mudah untuk meng-upgrade akun dari pembeli menjadi penjual.
- **Dashboard Penjual:** Melihat ringkasan statistik penjualan, pesanan baru, dan produk terjual.
- **Manajemen Produk:** Menambah, mengedit, dan menghapus produk di toko sendiri.
- **Manajemen Pesanan:** Melihat daftar pesanan yang masuk dan mengubah statusnya (misal: dari *Processing* menjadi *Shipped*).
- **Interaksi Pembeli:** Fitur chat *real-time* untuk berkomunikasi dengan calon pembeli.

### Fitur Lanjutan:
- **Dark Mode:** Pengaturan tema gelap dan terang yang nyaman di mata.
- **Notifikasi Real-time:** Notifikasi *pop up* untuk berbagai aksi dan pesan chat baru.
- **Keamanan:** Proteksi rute di frontend dan backend, serta validasi data di sisi server.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun dengan arsitektur full-stack yang memisahkan frontend dan backend.

### Frontend:
- **[React.js](https://reactjs.org/)** (dengan Vite)
- **[React Router](https://reactrouter.com/)**: Untuk navigasi dan routing.
- **[Axios](https://axios-http.com/)**: Untuk melakukan permintaan API ke backend.
- **[Socket.IO Client](https://socket.io/docs/v4/client-api/)**: Untuk komunikasi chat *real-time*.
- **[React Hot Toast](https://react-hot-toast.com/)**: Untuk notifikasi *pop up* yang elegan.
- **[React Icons](https://react-icons.github.io/react-icons/)**: Untuk ikon di seluruh aplikasi.

### Backend:
- **[Node.js](https://nodejs.org/)**
- **[Express.js](https://expressjs.com/)**: Framework untuk membangun REST API.
- **[MySQL2](https://github.com/sidorares/node-mysql2)**: Driver untuk menghubungkan Node.js dengan database MySQL.
- **[Socket.IO](https://socket.io/)**: Untuk menangani koneksi WebSocket dan chat *real-time*.
- **[JWT (JSON Web Token)](https://jwt.io/)**: Untuk autentikasi pengguna yang aman.
- **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)**: Untuk *hashing* password.
- **[CORS](https://github.com/expressjs/cors)**: Untuk mengizinkan komunikasi antara frontend dan backend.
- **[Multer](https://github.com/expressjs/multer)**: Untuk menangani *upload* file/gambar.

### Database:
- **[MySQL](https://www.mysql.com/)** (Dijalankan via XAMPP untuk development lokal).

## 🚀 Panduan Instalasi & Menjalankan

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat:
- [Node.js](https://nodejs.org/en/download/) (v18 atau lebih baru)
- [XAMPP](https://www.apachefriends.org/index.html) atau server MySQL lainnya
- [Git](https://git-scm.com/downloads)

### 1. Backend Setup
```bash
# 1. Clone repository ini
git clone [https://github.com/ryhnnas/Trolley.git](https://github.com/ryhnnas/Trolley.git)
cd Trolley/trolley-backend

# 2. Install semua dependensi
npm install
npm install express mysql2 cors dotenv bcrypt jsonwebtoken multer socket.io pg

# 3. Setup Database
#    - Jalankan Apache & MySQL di XAMPP.
#    - Buka phpMyAdmin, buat database baru bernama 'ecommerce_db'.
#    - Impor file 'database.sql' yang ada di root proyek ke dalam database 'ecommerce_db'.

# 4. Setup Environment Variable
#    - Salin file .env.example (jika ada) menjadi .env
#    - Sesuaikan kredensial database jika perlu.

# 5. Jalankan server backend
npm start
# Server akan berjalan di http://localhost:5000

### 2. Frontend Setup
```bash
# 1. Buka terminal baru, masuk ke folder frontend
cd ../trolley-frontend

# 2. Install semua dependensi
npm install
npm install axios react-router-dom react-hot-toast react-icons socket.io-client jwt-decode

# 3. Setup Environment Variable
#    - Pastikan ada file .env dengan isi sebagai berikut:
#      VITE_API_URL=http://localhost:5000/api
#      VITE_BACKEND_URL=http://localhost:5000

# 4. Jalankan aplikasi React
npm run dev
# Aplikasi akan berjalan di http://localhost:5173 (atau port lain)
