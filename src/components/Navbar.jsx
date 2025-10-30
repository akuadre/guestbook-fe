import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  CalendarDays,
  Clock,
  ChevronDown,
} from "lucide-react";
import axios from "axios"; // TAMBAH IMPORT AXIOS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [userData, setUserData] = useState(null);
  const [tahunAjaran, setTahunAjaran] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Ambil data user dan tahun ajaran dari localStorage
  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");
    const thnAjaranFromStorage = localStorage.getItem("thnajaran");
    
    if (userFromStorage) {
      try {
        setUserData(JSON.parse(userFromStorage));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserData({ name: "Admin", role: "Administrator" });
      }
    } else {
      setUserData({ name: "Admin", role: "Administrator" });
    }

    setTahunAjaran(thnAjaranFromStorage || "2024/2025");
  }, []);

  const user = {
    name: userData?.name || "Admin",
    role: userData?.role || "Administrator",
    avatar: null,
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now
          .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          .replace(".", ":")
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Panggil API logout jika ada token
      const token = localStorage.getItem("adminToken");
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Tetap lanjut logout meski API error
    } finally {
      // Clear semua data dari localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("idthnajaran");
      localStorage.removeItem("thnajaran");
      
      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return (
      names[0][0] + (names.length > 1 ? names[names.length - 1][0] : "")
    ).toUpperCase();
  };

  return (
    <motion.header
      className="fixed top-0 left-72 right-0 h-24 bg-white/70 backdrop-blur-xl z-30 shadow-sm shadow-black/5"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center h-full px-8">
        {/* Info Cluster: Jam dan TA */}
        <div className="flex items-center gap-4 bg-gray-100/80 border border-gray-200/80 rounded-full px-4 py-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} className="text-sky-600" />
            <span className="font-semibold text-sm font-mono tracking-wider">
              {currentTime}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays size={18} className="text-sky-600" />
            <span className="font-medium">
              TA: <strong className="text-gray-900">{tahunAjaran}</strong>
            </span>
          </div>
        </div>

        {/* Tombol Profil */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-200/60 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            {/* Avatar dengan status ring */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-offset-2 ring-offset-white ring-sky-300">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="p-2">
                  <div className="px-3 py-3 border-b border-gray-200 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                    <p className="text-xs text-sky-600 mt-1">
                      Tahun Ajaran: {tahunAjaran}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <User size={16} className="mr-3 text-gray-500" /> Profil Saya
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={16} className="mr-3 text-gray-500" /> Pengaturan
                  </Link>
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut size={16} className="mr-3" /> Keluar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;