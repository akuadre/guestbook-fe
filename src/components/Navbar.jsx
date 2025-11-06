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
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Ambil data user dari localStorage
  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");
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
  }, []);

  const user = {
    name: userData?.name || "Admin",
    role: userData?.role || "Administrator",
    avatar: "/gambar/iconsekolah.png",
  };

  // Clock functionality
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

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
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

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const academicYear =
    currentMonth >= 7
      ? `${currentYear}/${currentYear + 1}`
      : `${currentYear - 1}/${currentYear}`;

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Tamu Baru",
      message: "Budi Santoso telah mengisi buku tamu",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      title: "Pengingat",
      message: "Rapat orang tua siswa besok",
      time: "1 jam lalu",
      unread: true,
    },
    {
      id: 3,
      title: "Sistem",
      message: "Backup database berhasil",
      time: "2 hari lalu",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <motion.header
      className="fixed top-0 left-72 right-0 h-24 bg-white/80 backdrop-blur-xl z-30 border-b border-gray-200/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center h-full px-8 gap-8">
        {/* Left Section - Page Title/Breadcrumb */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Selamat datang kembali, {user.name}
          </p>
        </div>

        {/* Center Section - Time & Date */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 rounded-full shadow-lg border border-slate-600/30">
            <Clock size={18} className="text-sky-300" />
            <span className="font-bold text-sm font-mono tracking-wider">
              {currentTime}
            </span>
          </div>

          {/* Date & Academic Year */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-gray-700">
              {formattedDate}
            </span>
            <span className="text-xs text-blue-600 font-medium">
              TA {academicYear}
            </span>
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-gray-200/60 transition-colors duration-200">
            <HelpCircle size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg hover:bg-gray-200/60 transition-colors duration-200 relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Lihat Semua
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-right hidden lg:block">
                <p className="font-semibold text-sm text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>

              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      TA {academicYear}
                    </p>
                  </div>

                  <div className="p-2">
                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1">
                      <User size={16} className="mr-3 text-gray-500" />
                      Profil Saya
                    </button>

                    <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1">
                      <Settings size={16} className="mr-3 text-gray-500" />
                      Pengaturan
                    </button>

                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
