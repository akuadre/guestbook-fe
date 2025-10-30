import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Calendar, BookOpen, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const schoolImageUrl = 'gambar/smkn1cimahi.jpg';

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
    transition: { type: 'spring', stiffness: 100 },
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [thnajaran, setThnajaran] = useState('');
  const [thnajaranOptions, setThnajaranOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingTahunAjaran, setLoadingTahunAjaran] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Setup axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
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
          localStorage.removeItem('adminToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('idthnajaran');
          localStorage.removeItem('thnajaran');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Fetch tahun ajaran dari API - REAL DATA
  useEffect(() => {
    const fetchTahunAjaran = async () => {
      try {
        setLoadingTahunAjaran(true);
        const response = await axios.get(`${API_URL}/tahun-ajaran`);
        
        if (response.data.success) {
          setThnajaranOptions(response.data.data || []);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        console.error('Gagal mengambil data tahun ajaran:', err);
        setError('Gagal memuat data tahun ajaran. Silakan refresh halaman.');
        // Fallback ke dummy data jika API error
        const dummyOptions = [
          { idthnajaran: '1', thnajaran: '2023/2024' },
          { idthnajaran: '2', thnajaran: '2024/2025' },
        ];
        setThnajaranOptions(dummyOptions);
      } finally {
        setLoadingTahunAjaran(false);
      }
    };

    fetchTahunAjaran();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!thnajaran) {
      setError('Silakan pilih tahun ajaran terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        idthnajaran: thnajaran,
      });

      if (response.data.success) {
        // Simpan semua data ke localStorage
        localStorage.setItem('adminToken', response.data.data.access_token);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        localStorage.setItem('idthnajaran', response.data.data.idthnajaran);
        localStorage.setItem('thnajaran', response.data.data.thnajaran);
        
        // Redirect ke dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.email?.[0] ||
                          err.response?.data?.errors?.idthnajaran?.[0] || 
                          'Terjadi kesalahan saat login';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cek jika sudah login, redirect ke dashboard
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 lg:p-8">
      <motion.div
        className="relative w-full max-w-5xl h-auto lg:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Left Side (Form) */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-sky-500" />
            <h1 className="text-2xl font-bold text-gray-800">GuestBook Admin</h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-extrabold text-gray-900">Selamat Datang!</h2>
            <p className="text-gray-500 mt-2">Silakan masuk untuk mengelola sistem.</p>
          </motion.div>
          
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5"/>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={thnajaran}
                onChange={(e) => setThnajaran(e.target.value)}
                required
                disabled={loadingTahunAjaran}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {loadingTahunAjaran ? 'Memuat tahun ajaran...' : 'Pilih Tahun Ajaran'}
                </option>
                {thnajaranOptions.map((opt) => (
                  <option key={opt.idthnajaran} value={opt.idthnajaran}>
                    {opt.thnajaran}
                  </option>
                ))}
              </select>
              {loadingTahunAjaran && (
                <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading || loadingTahunAjaran}
                className="w-full flex items-center justify-center py-3 px-6 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 disabled:bg-sky-300 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="animate-spin w-6 h-6" /> : 'Masuk'}
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Right Side (Image) */}
        <div className="relative flex-1 hidden lg:block">
          <img
            src={schoolImageUrl}
            alt="SMKN 1 Cimahi"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/60 to-blue-800/70 flex flex-col items-center justify-center p-12 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.img
                src="gambar/iconsekolah.png"
                alt="Icon Sekolah"
                className="w-32 h-32 object-contain mx-auto mb-4"
                whileHover={{
                  scale: 1.15,
                  opacity: 0.9,
                  y: -10,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <h2 className="text-3xl font-bold leading-tight">
                Sistem Buku Tamu Digital
              </h2>
              <p className="mt-2 text-xl font-semibold text-white">
                SMKN 1 Cimahi
              </p>
              <p className="mt-4 text-lg opacity-90">
                Mencatat dan mengelola kunjungan tamu dengan lebih efisien, modern, dan terstruktur.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;