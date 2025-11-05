import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, BookOpen, Loader, AlertCircle, School, Shield, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const schoolImageUrl = 'gambar/smkn1cimahi.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.data.access_token);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.email?.[0] ||
                          'Terjadi kesalahan saat login';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-60 h-60 bg-indigo-500/5 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-6xl h-auto lg:h-[700px] bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col lg:flex-row"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glow Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-blue-500/5 rounded-3xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Left Side (Form) */}
        <motion.div
          className="w-full lg:w-2/5 flex flex-col justify-center p-8 sm:p-12 lg:p-16 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center lg:text-left mb-10">
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                  GuestBook
                </h1>
                <p className="text-sky-300/80 text-sm font-medium">Admin Portal</p>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              Welcome Back
            </h2>
            <p className="text-sky-200/70 text-lg">Sign in to manage your system</p>
          </motion.div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm backdrop-blur-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0"/>
                <span>{error}</span>
              </motion.div>
            )}
            
            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/70 z-10" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-sky-200/40 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/30 transition-all duration-300 backdrop-blur-sm relative z-20"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400/70 z-10" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-sky-200/40 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/30 transition-all duration-300 backdrop-blur-sm relative z-20"
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-sky-500/25 hover:shadow-3xl hover:shadow-sky-500/40 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
                {loading ? (
                  <Loader className="animate-spin w-6 h-6" />
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Access Dashboard
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Additional Info */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <motion.div
                variants={floatingAnimation}
                animate="animate"
              >
                <School className="w-6 h-6 text-sky-400" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-white">SMKN 1 Cimahi</p>
                <p className="text-xs text-sky-300/70 mt-1">Digital Guest Management System</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side (Image & Info) */}
        <div className="relative flex-1 hidden lg:block overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <img
              src={schoolImageUrl}
              alt="SMKN 1 Cimahi"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-sky-900/70 flex flex-col items-center justify-center p-12 text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="max-w-md"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 shadow-2xl"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img
                  src="gambar/iconsekolah.png"
                  alt="Icon Sekolah"
                  className="w-28 h-28 object-contain mx-auto mb-6"
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <BookOpen className="w-12 h-12 text-sky-300 mx-auto mb-4" />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold leading-tight mb-4 bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Digital Guest Management
              </motion.h2>
              
              <motion.p 
                className="text-xl font-semibold text-sky-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                SMKN 1 Cimahi
              </motion.p>
              
              <motion.p 
                className="text-sky-200/80 leading-relaxed text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Advanced digital solution for efficient visitor management, modern tracking, and professional school administration.
              </motion.p>

              {/* Feature Pills */}
              <motion.div 
                className="flex flex-wrap gap-2 justify-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {['Secure', 'Modern', 'Efficient', 'Professional'].map((feature, index) => (
                  <motion.span
                    key={feature}
                    className="px-3 py-1 bg-sky-500/20 border border-sky-400/30 rounded-full text-xs text-sky-300 backdrop-blur-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.3)' }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;