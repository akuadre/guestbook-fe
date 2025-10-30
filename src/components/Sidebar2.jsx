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

// REFACTOR: Membuat komponen NavItem untuk kerapian dan animasi
const NavItem = ({ to, icon: Icon, children, isSubItem = false }) => {
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-4 w-full text-sm p-3 rounded-lg transition-colors duration-300 relative ${
      isSubItem ? "pl-12" : "pl-4"
    } ${
      isActive
        ? "bg-sky-500/10 text-white font-semibold"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <NavLink to={to} className={getLinkClass}>
        {({ isActive }) => (
          <>
            {/* EFEK GLOW UNTUK ITEM AKTIF */}
            {isActive && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 bg-sky-400/20 rounded-lg blur-lg"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-4">
              <Icon size={isSubItem ? 16 : 20} />
              <span>{children}</span>
            </div>
          </>
        )}
      </NavLink>
    </motion.div>
  );
};

const Sidebar2 = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = {};
    if (path.startsWith("/siswa") || path.startsWith("/orangtua"))
      newOpenMenus.siswa = true;
    if (path.startsWith("/pegawai") || path.startsWith("/jabatan"))
      newOpenMenus.pegawai = true;
    if (path.startsWith("/bukutamu")) newOpenMenus.bukuTamu = true;
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const handleMenuToggle = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Varian untuk animasi stagger
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    // UBAHAN: Gradient background mewah dan border halus
    <aside className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-[#111827] to-[#1a254a] flex flex-col z-40 border-r border-white/10">
      {/* App Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-white/10">
        <motion.img
          src={logoIcon}
          alt="App Logo"
          className="h-10 w-10"
          animate={{ rotate: [0, 15, -10, 5, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <div>
          <Link
            to="/dashboard"
            className="text-xl font-bold text-white tracking-wider"
          >
            GuestBook
          </Link>
          <p className="text-xs text-sky-300/70">Admin Panel</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <motion.ul variants={listVariants} initial="hidden" animate="visible">
          <motion.li variants={itemVariants}>
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </p>
          </motion.li>

          <motion.li variants={itemVariants}>
            <NavItem to="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItem>
          </motion.li>

          {/* Dropdown Siswa */}
          <motion.li variants={itemVariants} className="space-y-1">
            <DropdownButton
              onToggle={() => handleMenuToggle("siswa")}
              isOpen={openMenus.siswa}
              icon={GraduationCap}
            >
              Siswa
            </DropdownButton>
            <AnimatePresence>
              {openMenus.siswa && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <NavItem to="/siswa" icon={User} isSubItem>
                    Data Siswa
                  </NavItem>
                  <NavItem to="/orangtua" icon={Users} isSubItem>
                    Data Orang Tua
                  </NavItem>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Dropdown Pegawai */}
          <motion.li variants={itemVariants} className="space-y-1">
            <DropdownButton
              onToggle={() => handleMenuToggle("pegawai")}
              isOpen={openMenus.pegawai}
              icon={Building}
            >
              Pegawai
            </DropdownButton>
            <AnimatePresence>
              {openMenus.pegawai && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <NavItem to="/jabatan" icon={ClipboardList} isSubItem>
                    Data Jabatan
                  </NavItem>
                  <NavItem to="/pegawai" icon={Users} isSubItem>
                    Data Pegawai
                  </NavItem>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>

          {/* Dropdown Buku Tamu */}
          <motion.li variants={itemVariants} className="space-y-1">
            <DropdownButton
              onToggle={() => handleMenuToggle("bukuTamu")}
              isOpen={openMenus.bukuTamu}
              icon={BookOpen}
            >
              Buku Tamu
            </DropdownButton>
            <AnimatePresence>
              {openMenus.bukuTamu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <NavItem to="/bukutamu" icon={BookOpen} isSubItem>
                    Data Buku Tamu
                  </NavItem>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        </motion.ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <NavItem to="/about" icon={Info}>
          Tentang Aplikasi
        </NavItem>
      </div>
    </aside>
  );
};

// Komponen helper untuk tombol dropdown
const DropdownButton = ({ onToggle, isOpen, icon: Icon, children }) => (
  <motion.button
    onClick={onToggle}
    className="flex items-center justify-between w-full text-sm p-3 rounded-lg transition-colors duration-300 text-gray-400 hover:text-white hover:bg-white/5 pl-4"
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="flex items-center gap-4">
      <Icon size={20} />
      <span>{children}</span>
    </div>
    <ChevronRight
      size={16}
      className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
    />
  </motion.button>
);

export default Sidebar2;
