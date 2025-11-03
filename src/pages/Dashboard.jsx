import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Building,
  Briefcase,
  BookOpen,
  BarChart2,
  UserCheck,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import axios from "axios";

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1 
    } 
  },
};
const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    } 
  },
};

// Helper functions for date and chart data
const getTodayString = () => {
  const today = new Date();
  today.setHours(today.getHours() + 7);
  return today.toISOString().split("T")[0];
};

const fetchChartData = async (filterType, options) => {
  try {
    const params = {
      filter_type: filterType,
      ...options,
    };

    const response = await axios.get(`${API_URL}/bukutamu/grafik`, { params });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Gagal mengambil data grafik");
    }
  } catch (err) {
    console.error("Error fetching chart data:", err);
    // Fallback ke data dummy jika API error
    return generateFallbackChartData(filterType, options);
  }
};

// Fallback data jika API error
const generateFallbackChartData = (filterType, options) => {
  let labels = [];
  let data = [];
  const random = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  switch (filterType) {
    case "harian":
      labels = [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ];
      data = labels.map(() => random(0, 15));
      break;
    case "mingguan":
      labels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      data = labels.map(() => random(5, 25));
      break;
    case "bulanan":
      const daysInMonth = new Date(
        options.year,
        options.month + 1,
        0
      ).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      data = labels.map(() => random(10, 50));
      break;
    case "tahunan":
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      data = labels.map(() => random(100, 500));
      break;
    default:
      break;
  }

  return {
    labels,
    datasets: [
      {
        label: "Jumlah Tamu",
        data,
        borderColor: "rgba(59, 130, 246, 0.8)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };
};

// Komponen Kartu Statistik
const StatCard = ({ title, value, icon, color, link }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-gradient-to-br ${color} rounded-xl shadow-lg text-white overflow-hidden transform hover:-translate-y-1 transition-transform duration-300`}
  >
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="opacity-80">{title}</p>
        </div>
        <div className="text-white opacity-50">{icon}</div>
      </div>
    </div>
    <Link
      to={link}
      className="block bg-black bg-opacity-20 hover:bg-opacity-30 text-white text-center py-2.5 px-4 transition-colors"
    >
      <span className="flex items-center justify-center text-sm">
        Lihat Detail <ArrowRight className="w-4 h-4 ml-1.5" />
      </span>
    </Link>
  </motion.div>
);

// Komponen Skeleton untuk Kartu dengan shimmer effect
const StatCardSkeleton = () => (
  <div className="bg-gray-200 rounded-xl shadow-lg h-36 relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
  </div>
);

// Komponen Skeleton untuk Tabel
const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
      >
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
        <div className="flex-1 ml-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
        <div className="w-1/5 ml-4">
          <div className="h-4 bg-gray-200 rounded float-right w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [recentGuests, setRecentGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // State untuk filter
  const [filterType, setFilterType] = useState("harian");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedWeek, setSelectedWeek] = useState({
    year: 2025,
    month: 8,
    week: 4,
  });
  const [selectedMonth, setSelectedMonth] = useState({ year: 2025, month: 8 });
  const [selectedYear, setSelectedYear] = useState(2025);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`);
      const data = res.data;

      setStats({
        totalSiswa: data.stats.totalSiswa || 0,
        totalOrangtua: data.stats.totalOrangtua || 0,
        totalJabatan: data.stats.totalJabatan || 0,
        totalPegawai: data.stats.totalPegawai || 0,
        totalBukuTamu: data.stats.totalBukuTamu || 0,
      });

      setRecentGuests(data.recentGuests || []);
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
      // Set data dummy jika API gagal
      setStats({
        totalSiswa: 0,
        totalOrangtua: 0,
        totalJabatan: 0,
        totalPegawai: 0,
        totalBukuTamu: 0,
      });
      setRecentGuests([]);
    } finally {
      setLoading(false);
    }
  };

  // TAMBAH FUNGSI NOTIFICATION
  const showNotif = (type, text) => {
    setNotification({ type, text });
    // Auto dismiss setelah 5 detik
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // TAMBAH KOMPONEN NOTIFICATION
  const Notification = ({ notification, onDismiss }) => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    };

    useEffect(() => {
      if (notification) {
        const timer = setTimeout(() => {
          onDismiss();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [notification, onDismiss]);

    return (
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
        {notification && (
          <div
            className={`flex items-center gap-3 text-white p-4 rounded-xl shadow-2xl ${
              colors[notification.type]
            }`}
          >
            <span className="text-lg">{icons[notification.type]}</span>
            <span className="font-medium">{notification.text}</span>
            <button
              onClick={onDismiss}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      const loadChartData = async () => {
        const options = {
          harian: { date: selectedDate },
          mingguan: selectedWeek,
          bulanan: selectedMonth,
          tahunan: { year: selectedYear },
        };

        const chartData = await fetchChartData(filterType, options[filterType]);
        setChartData(chartData);
      };

      loadChartData();
    }
  }, [
    filterType,
    selectedDate,
    selectedWeek,
    selectedMonth,
    selectedYear,
    loading,
  ]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 5 } },
    },
  };

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi, Admin!";
    if (hour < 18) return "Selamat Siang, Admin!";
    return "Selamat Malam, Admin!";
  };

  const getChartTitle = () => {
    switch (filterType) {
      case "harian":
        return `Statistik Kunjungan - ${new Date(
          selectedDate + "T00:00:00"
        ).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`;
      case "mingguan":
        return `Statistik Kunjungan - Minggu ke-${
          selectedWeek.week
        }, ${new Date(selectedWeek.year, selectedWeek.month).toLocaleString(
          "id-ID",
          { month: "long", year: "numeric" }
        )}`;
      case "bulanan":
        return `Statistik Kunjungan - ${new Date(
          selectedMonth.year,
          selectedMonth.month
        ).toLocaleString("id-ID", { month: "long", year: "numeric" })}`;
      case "tahunan":
        return `Statistik Kunjungan - Tahun ${selectedYear}`;
      default:
        return "Statistik Kunjungan Tamu";
    }
  };

  return (
    <div className="space-y-8">
      {/* Tambahkan custom CSS untuk animasi shimmer di global style */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <motion.h1
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {welcomeMessage()}
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Berikut adalah ringkasan data dari sistem Anda.
          </motion.p>
        </div>
      </div>

      {/* Stat Cards Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          // Skeleton dengan animasi
          Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <StatCardSkeleton />
            </motion.div>
          ))
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Siswa"
                value={stats.totalSiswa}
                icon={<GraduationCap size={48} />}
                color="from-blue-500 to-blue-600"
                link="/siswa"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Jabatan"
                value={stats.totalJabatan}
                icon={<Building size={48} />}
                color="from-indigo-500 to-indigo-600"
                link="/jabatan"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Pegawai"
                value={stats.totalPegawai}
                icon={<Briefcase size={48} />}
                color="from-red-500 to-red-600"
                link="/pegawai"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Tamu"
                value={stats.totalBukuTamu}
                icon={<BookOpen size={48} />}
                color="from-gray-700 to-gray-800"
                link="/bukutamu"
              />
            </motion.div>
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-xl p-6 lg:col-span-2"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-500" />
              {getChartTitle()}
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="harian">Harian</option>
                <option value="mingguan">Mingguan</option>
                <option value="bulanan">Bulanan</option>
                <option value="tahunan">Tahunan</option>
              </select>
            </div>
          </div>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex flex-wrap items-center gap-4 text-sm">
            {filterType === "harian" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={getTodayString()}
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            {/* Filter lain bisa ditambahkan kembali di sini jika perlu */}
          </div>
          <div className="h-80">
            {loading || !chartData.labels ? (
              <div className="w-full h-full bg-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </motion.div>

        {/* Recent Guests Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <UserCheck className="w-6 h-6 mr-2 text-green-500" /> Tamu Terbaru
          </h2>
          <div>
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 uppercase text-xs font-semibold border-b-2 border-gray-200">
                <tr>
                  <th className="py-2 px-3 w-2/5">Nama Tamu</th>
                  <th className="py-2 px-3 w-2/5">Keperluan</th>
                  <th className="py-2 px-3 w-1/5 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton table dengan 5 baris
                  <tr>
                    <td colSpan={3} className="py-3">
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : recentGuests.length > 0 ? (
                  recentGuests.map((guest, index) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="py-3 px-3 font-medium text-gray-800">
                        {guest.nama}
                        {guest.role === "ortu" && (
                          <span className="block text-xs text-gray-500">
                            Orang Tua Siswa
                          </span>
                        )}
                        {guest.role === "umum" && guest.instansi && (
                          <span className="block text-xs text-gray-500">
                            {guest.instansi}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {guest.keperluan}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-right">
                        {guest.tanggal}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      Tidak ada data tamu
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
