import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ChevronRight,
  Building,
  User,
  ClipboardList,
  Info,
} from "lucide-react";

const logoIcon = "/gambar/icon2.png";

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  // Efek untuk membuka dropdown menu sesuai dengan URL saat ini
  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = {};

    if (path.startsWith("/siswa") || path.startsWith("/orangtua")) {
      newOpenMenus.siswa = true;
    }
    if (path.startsWith("/pegawai") || path.startsWith("/jabatan")) {
      newOpenMenus.pegawai = true;
    }
    if (path.startsWith("/bukutamu")) {
      newOpenMenus.bukuTamu = true;
    }
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const handleMenuToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Styling untuk link yang aktif dan tidak aktif
  const getLinkClass = ({ isActive }) =>
    `flex items-center justify-between w-full text-sm p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-sky-500/10 text-sky-300 font-semibold border-l-4 border-sky-400"
        : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
    }`;

  // Varian animasi untuk dropdown menu
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <aside className="fixed top-0 left-0 w-72 h-full bg-[#1a254a] flex flex-col z-40">
      {/* App Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
        <img src={logoIcon} alt="App Logo" className="h-9 w-9" />
        <Link to="/dashboard" className="text-xl font-bold text-white">
          GuestBook
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu
        </p>

        {/* Dashboard */}
        <NavLink to="/dashboard" className={getLinkClass}>
          <div className="flex items-center gap-4">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Dropdown Siswa */}
        <div className="space-y-1">
          <button
            onClick={() => handleMenuToggle("siswa")}
            className={getLinkClass({})}
          >
            <div className="flex items-center gap-4">
              <GraduationCap size={20} />
              <span>Siswa</span>
            </div>
            <ChevronRight
              size={16}
              className={`transition-transform ${
                openMenus.siswa ? "rotate-90" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openMenus.siswa && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="pl-8 space-y-1 overflow-hidden"
              >
                <NavLink to="/siswa" className={getLinkClass}>
                  <span>
                    <User size={16} className="inline mr-2" />
                    Data Siswa
                  </span>
                </NavLink>
                <NavLink to="/orangtua" className={getLinkClass}>
                  <span>
                    <Users size={16} className="inline mr-2" />
                    Data Orang Tua
                  </span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown Pegawai */}
        <div className="space-y-1">
          <button
            onClick={() => handleMenuToggle("pegawai")}
            className={getLinkClass({})}
          >
            <div className="flex items-center gap-4">
              <Building size={20} />
              <span>Pegawai</span>
            </div>
            <ChevronRight
              size={16}
              className={`transition-transform ${
                openMenus.pegawai ? "rotate-90" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openMenus.pegawai && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="pl-8 space-y-1 overflow-hidden"
              >
                <NavLink to="/jabatan" className={getLinkClass}>
                  <span>
                    <ClipboardList size={16} className="inline mr-2" />
                    Data Jabatan
                  </span>
                </NavLink>
                <NavLink to="/pegawai" className={getLinkClass}>
                  <span>
                    <Users size={16} className="inline mr-2" />
                    Data Pegawai
                  </span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown Buku Tamu */}
        <div className="space-y-1">
          <button
            onClick={() => handleMenuToggle("bukuTamu")}
            className={getLinkClass({})}
          >
            <div className="flex items-center gap-4">
              <BookOpen size={20} />
              <span>Buku Tamu</span>
            </div>
            <ChevronRight
              size={16}
              className={`transition-transform ${
                openMenus.bukuTamu ? "rotate-90" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openMenus.bukuTamu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="pl-8 space-y-1 overflow-hidden"
              >
                <NavLink to="/bukutamu" className={getLinkClass}>
                  <span>
                    <BookOpen size={16} className="inline mr-2" />
                    Data Buku Tamu
                  </span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <Link to="/about" className={getLinkClass({})}>
          <div className="flex items-center gap-4">
            <Info size={20} />
            <span>Tentang Aplikasi</span>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
