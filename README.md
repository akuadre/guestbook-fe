# Guestbook Client 🎨

> Antarmuka (User Interface) interaktif untuk sistem Guestbook Digital. Menghadirkan pengalaman pengguna yang modern, sangat responsif, dilengkapi animasi mulus, serta fitur real-time dashboard untuk pengelolaan admin tingkat lanjut.

## 🛠 Tech Stack

- **Framework:** React 19 + Vite (SWC Plugin)
- **Styling:** Tailwind CSS v4, Styled Components
- **Animations:** Framer Motion
- **Icons & UI Assets:** Lucide React
- **Data Fetching:** Axios
- **Routing:** React Router v7
- **Charts / Visualisasi:** Chart.js, Recharts, React-Chartjs-2
- **Utilities Khusus:** React-Webcam (untuk tangkapan kamera/foto tamu secara langsung)

## ✨ Features

- **High-End UI/UX:** Desain bersih dan modern dengan palet warna Monochrome & Gradient, diperindah dengan transisi interaktif berkinerja tinggi dari Framer Motion.
- **Persistent Notification System:** Implementasi *Success Modal* kustom berbasis React Portal dengan URL Parameter interception (Bebas dari masalah z-index & stacking context).
- **Responsive Design:** Kompatibel 100% dan *mobile-first ready* (Desktop, Tablet, dan Mobile).
- **Interactive Dashboard:** Data tabel informatif, statistik chart, dan sinkronisasi yang stabil dengan backend Laravel API.
- **Hardware Integration:** Mengambil foto wajah dari kamera hardware perangkat langsung di browser web.

## 📂 Folder Structure

Struktur direktori utama di dalam `src/`:

```text
src/
├── components/   # Komponen UI Reusable (Navbar, Sidebar, SuccessModal, FormCard, dll)
├── pages/        # Komponen Halaman penuh (LandingPage, Login, Dashboard, GuestbookPage)
├── App.jsx       # Root component & Konfigurasi React Router
├── index.css     # Global styles & Tailwind entry point
└── main.jsx      # React DOM entry point
```

## ⚙️ Setup & Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi client secara lokal:

1. **Clone repositori dan masuk ke direktori frontend:**
   ```bash
   cd guestbook-fe
   ```

2. **Install dependensi NPM:**
   Gunakan package manager pilihan Anda (contoh: npm):
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat file bernama `.env` di root folder `guestbook-fe` dan hubungkan ke base URL backend API:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Jalankan Server Development:**
   Mulai compiler Vite:
   ```bash
   npm run dev
   ```
   > Aplikasi akan otomatis berjalan pada: `http://localhost:5173`

## 🔗 Demo & Screenshots

> *[Tambahkan link demonstrasi aplikasi atau live hosting di sini]*

**Screenshots:**

*(Ganti tanda '#' dengan path gambar sebenarnya)*
- ![Landing Page Placeholder](#)
- ![Admin Dashboard Placeholder](#)
- ![Success Modal Placeholder](#)

---
*Dibuat dengan ❤️ untuk kemudahan administrasi digital.*
