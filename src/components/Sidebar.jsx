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

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

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

  const getLinkClass = ({ isActive }) =>
    `relative flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-300 group ${
      isActive
        ? "bg-gradient-to-r from-sky-500/20 to-transparent text-white shadow-inner"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  const getSubLinkClass = ({ isActive }) =>
    `flex items-center w-full text-sm p-2.5 px-6 rounded-xl transition-all duration-200 ${
      isActive
        ? "text-sky-300 bg-sky-500/10 font-medium"
        : "text-gray-500 hover:text-gray-300 hover:bg-gray-700/30"
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
      <motion.nav
        className="flex-1 p-4 space-y-1 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5"
        >
          Navigation
        </motion.p>

        {/* Menu items dengan modern touch */}
        <motion.div variants={itemVariants}>
          <NavLink to="/dashboard" className={getLinkClass}>
            {({ isActive }) => (
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-sky-500"
                      : "bg-gray-700 group-hover:bg-sky-500"
                  } transition-colors duration-300`}
                >
                  <LayoutDashboard size={18} />
                </div>
                <span>Dashboard</span>
              </div>
            )}
          </NavLink>
        </motion.div>

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
          <motion.div
            key={menu.key}
            className="space-y-1"
            variants={itemVariants}
          >
            <button
              onClick={() => handleMenuToggle(menu.key)}
              className={getLinkClass({})}
            >
              <div className="flex items-center gap-4">
                <menu.icon size={20} /> <span>{menu.label}</span>
              </div>
              <motion.div
                animate={{ rotate: openMenus[menu.key] ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ChevronRight size={16} />
              </motion.div>
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
                  <div className="pl-8 ml-4 border-l border-gray-700 space-y-1 pt-1">
                    {menu.sub.map((subItem, index) => (
                      <motion.div key={subItem.path} variants={itemVariants}>
                        <NavLink to={subItem.path} className={getSubLinkClass}>
                          <subItem.icon size={16} className="inline mr-2" />
                          <span>{subItem.label}</span>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.nav>
      
      {/* Sidebar Footer */}
      <motion.div
        className="p-4 border-t border-white/10"
        variants={itemVariants}
      >
        <Link to="/about" className={getLinkClass({})}>
          <div className="flex items-center gap-4">
            <Info size={20} /> <span>Tentang Aplikasi</span>
          </div>
        </Link>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
