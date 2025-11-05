import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Calendar,
  BookOpen,
  Loader,
  AlertCircle,
  School,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const schoolImageUrl = "gambar/smkn1cimahi.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Setup axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("userData");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Simpan semua data ke localStorage
        localStorage.setItem("adminToken", response.data.data.access_token);
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.data.user)
        );

        // Redirect ke dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Terjadi kesalahan saat login";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cek jika sudah login, redirect ke dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4 lg:p-8">
      <motion.div
        className="relative w-full max-w-5xl h-auto lg:h-[650px] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Left Side (Form) */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 bg-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              GuestBook Admin
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-800">
              Selamat Datang!
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Silakan masuk untuk mengelola sistem
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all duration-200 placeholder-gray-400"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all duration-200 placeholder-gray-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30"
              >
                {loading ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </motion.div>
          </form>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-8 p-4 bg-sky-50 rounded-xl border border-sky-100"
          >
            <div className="flex items-start gap-3">
              <School className="w-5 h-5 text-sky-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-sky-800">
                  SMKN 1 Cimahi
                </p>
                <p className="text-xs text-sky-600 mt-1">
                  Sistem manajemen kunjungan tamu digital
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side (Image) */}
        <div className="relative flex-1 hidden lg:block">
          <img
            src={schoolImageUrl}
            alt="SMKN 1 Cimahi"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Overlay yang lebih soft */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/70 via-blue-800/50 to-sky-700/60 flex flex-col items-center justify-center p-12 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="max-w-md"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img
                  src="gambar/iconsekolah.png"
                  alt="Icon Sekolah"
                  className="w-24 h-24 object-contain mx-auto mb-4"
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>

              <h2 className="text-2xl font-bold leading-tight mb-3">
                Sistem Buku Tamu Digital
              </h2>
              <p className="text-lg font-semibold text-sky-200 mb-4">
                SMKN 1 Cimahi
              </p>
              <p className="text-sm opacity-90 leading-relaxed">
                Mencatat dan mengelola kunjungan tamu dengan lebih efisien,
                modern, dan terstruktur untuk lingkungan sekolah yang
                profesional.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
