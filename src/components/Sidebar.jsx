// src/components/Sidebar.jsx

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

  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = {};
    const menuMapping = {
      siswa: ["/siswa", "/orangtua"],
      pegawai: ["/pegawai", "/jabatan"],
      bukuTamu: ["/bukutamu"],
    };

    for (const menu in menuMapping) {
      if (menuMapping[menu].some((prefix) => path.startsWith(prefix))) {
        newOpenMenus[menu] = true;
      }
    }
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const handleMenuToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // [!!!] FUNGSI STYLING BARU - KUNCI DARI TAMPILAN MEWAH
  const getLinkClass = ({ isActive }) =>
    `relative flex items-center justify-between w-full p-3 px-4 rounded-lg transition-all duration-300 ease-in-out group ${
      isActive
        ? "bg-gradient-to-r from-sky-500/20 to-sky-500/0 text-white font-semibold shadow-[inset_2px_0_0_0_#0ea5e9,0_0_15px_rgba(56,189,248,0.2)]"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;

  const getSubLinkClass = ({ isActive }) =>
    `relative flex items-center w-full text-sm p-2 px-3 rounded-md transition-all duration-200 ${
      isActive
        ? "text-sky-300 font-medium bg-sky-500/10"
        : "text-gray-500 hover:bg-gray-700/50 hover:text-gray-300"
    }`;

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    // [!] Background Gradient Mewah dan penambahan border kanan lembut
    <aside className="fixed top-0 left-0 w-72 h-full bg-gradient-to-br from-[#101831] to-[#1a254a] flex flex-col z-40 border-r border-white/10">
      {/* App Header - Glassmorphism */}
      {/* <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-sky-500/10 to-purple-500/10 backdrop-blur-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-purple-400/5 blur-sm"></div>

        <div className="relative flex items-center gap-4 z-10">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={logoIcon}
              alt="App Logo"
              className="h-12 w-12 rounded-2xl border-2 border-white/20 shadow-lg"
            />
            <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/30 animate-ping"></div>
          </motion.div>

          <div>
            <Link
              to="/dashboard"
              className="text-2xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent"
            >
              GuestBook
            </Link>
            <p className="text-xs text-sky-300/80 font-medium mt-1">
              Admin Dashboard
            </p>
          </div>
        </div>
      </div> */}

      {/* App Header - Modern Minimalist */}
      <motion.div
        className="px-6 py-6 border-b border-white/5 bg-black/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, 0],
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-purple-400 rounded-lg blur opacity-30"></div>
            <img
              src={logoIcon}
              alt="App Logo"
              className="relative h-12 w-12 rounded-lg border border-white/10"
            />
          </motion.div>

          <div>
            <Link
              to="/dashboard"
              className="text-2xl font-bold text-white block leading-tight"
            >
              GuestBook
            </Link>
            <motion.p
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Management System
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu
        </p>

        {/* Dashboard */}
        <NavLink to="/dashboard" className={getLinkClass}>
          <div className="flex items-center gap-4">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Dropdown Menu */}
        {[
          {
            key: "siswa",
            icon: GraduationCap,
            label: "Siswa",
            sub: [
              { path: "/siswa", label: "Data Siswa", icon: User },
              // { path: "/orangtua", label: "Data Orang Tua", icon: Users },
            ],
          },
          {
            key: "pegawai",
            icon: Building,
            label: "Pegawai",
            sub: [
              { path: "/jabatan", label: "Data Jabatan", icon: ClipboardList },
              { path: "/pegawai", label: "Data Pegawai", icon: Users },
            ],
          },
          {
            key: "bukuTamu",
            icon: BookOpen,
            label: "Buku Tamu",
            sub: [
              { path: "/bukutamu", label: "Data Buku Tamu", icon: BookOpen },
            ],
          },
        ].map((menu) => (
          <div key={menu.key} className="space-y-1">
            <button
              onClick={() => handleMenuToggle(menu.key)}
              className={getLinkClass({})}
            >
              <div className="flex items-center gap-4">
                <menu.icon size={20} /> <span>{menu.label}</span>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform duration-300 ${
                  openMenus[menu.key] ? "rotate-90" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openMenus[menu.key] && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  {/* [!] Desain Sub-menu baru dengan garis indikator */}
                  <div className="pl-8 ml-4 border-l border-gray-700 space-y-1 pt-1">
                    {menu.sub.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={getSubLinkClass}
                      >
                        <subItem.icon size={16} className="inline mr-2" />
                        <span>{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <Link to="/about" className={getLinkClass({})}>
          <div className="flex items-center gap-4">
            <Info size={20} /> <span>Tentang Aplikasi</span>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
