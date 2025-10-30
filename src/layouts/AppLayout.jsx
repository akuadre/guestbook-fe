import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Sidebar2 from "../components/Sidebar2";
import Sidebar3 from "../components/Sidebar3";
import Footer from "../components/Footer";

const AppLayout = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Sidebar kini full height dan fixed di kiri */}
      {/* <Sidebar /> */}
      {/* <Sidebar2 /> */}
      <Sidebar3 />
      
      {/* Navbar juga fixed, tapi dimulai setelah sidebar */}
      <Navbar />

      {/* Kontainer utama untuk konten halaman */}
      {/* ml-72: Memberi ruang untuk sidebar */}
      <div className="relative ml-72 flex flex-col min-h-screen">
        
        {/* pt-20: Memberi ruang untuk navbar setinggi h-20 (80px) */}
        <main className="flex-grow p-8 pt-28">
          <Outlet />
        </main>
        
        {/* Footer akan 'menempel' di bawah jika konten pendek */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;