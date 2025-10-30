import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

// Import komponen halaman baru sesuai sidebar
import Dashboard from "./pages/Dashboard.jsx";
import Siswa from "./pages/Siswa.jsx";
import Pegawai from "./pages/Pegawai.jsx";
import BukuTamu from "./pages/BukuTamu.jsx";
import About from "./pages/About.jsx";

import OrangTua from "./pages/OrangTua.jsx";
import Jabatan from "./pages/Jabatan.jsx";

import { GuestRoute, ProtectedRoute } from "./routes/AuthRoutes.jsx";

// BUAT COMPONENT TERPISAH UNTUK SCROLL TO TOP
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // DISABLE BROWSER'S NATIVE SCROLL RESTORATION
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // FORCE SCROLL TO TOP
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      // Extra insurance - scroll document element juga
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll
    scrollToTop();

    // Additional scroll after a tiny delay (for React re-render)
    const timer = setTimeout(scrollToTop, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle initial page load/refresh specifically
  useEffect(() => {
    const handleLoad = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run on initial load
    handleLoad();

    // Also run when window finishes loading
    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return null;
}
function App() {
  return (
    <Router>
      {/* TAMBAHKAN SCROLL TO TOP DI DALAM ROUTER */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rute untuk halaman Login (Guest Only) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rute yang dilindungi, butuh login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/siswa" element={<Siswa />} />
            {/* <Route path="/orangtua" element={<OrangTua />} /> */}
            {/* <Route path="/jabatan" element={<Jabatan />} /> */}
            <Route path="/pegawai" element={<Pegawai />} />
            <Route path="/bukutamu" element={<BukuTamu />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Route>

        {/* Jika rute tidak ditemukan, arahkan ke halaman utama */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
