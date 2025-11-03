import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AppLayout = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Sidebar />
      <Navbar />

      {/* Kontainer utama untuk konten halaman */}
      <div className="relative ml-72 flex flex-col min-h-screen">
        <main className="flex-grow p-8 pt-28">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;