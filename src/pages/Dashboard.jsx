import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Building,
  Briefcase,
  BookOpen,
  BarChart2,
  UserCheck,
  RefreshCw, // Icon untuk sinkronisasi
  Loader, // Icon untuk loading
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
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// Helper functions for date and chart data
const getTodayString = () => {
  const today = new Date();
  today.setHours(today.getHours() + 7);
  return today.toISOString().split("T")[0];
};

const generateChartData = (filterType, options) => {
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
  <div
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
  </div>
);

// Komponen Skeleton untuk Kartu
const StatCardSkeleton = () => (
  <div className="bg-gray-200 rounded-xl shadow-lg h-36 animate-pulse"></div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({});
  const [recentGuests, setRecentGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState(null); // TAMBAH STATE INI

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
      // Tidak perlu setLoading(true) di sini agar refresh tidak berkedip
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

  // Fungsi untuk memanggil API sinkronisasi
  const handleSync = async () => {
    if (isSyncing) return; // Prevent multiple clicks

    setIsSyncing(true);

    try {
      const response = await axios.post(
        `${API_URL}/sync-manual`,
        {},
        {
          timeout: 300000, // 5 minutes timeout untuk proses yang lama
        }
      );

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message ||
            "✅ Sinkronisasi berhasil! Data sudah diperbarui."
        );

        // Refresh data langsung
        await fetchDashboard();
      } else {
        showNotif(
          "error",
          response.data.message || "❌ Sinkronisasi gagal! Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Sync error details:", error);

      let errorMessage = "Terjadi kesalahan saat sinkronisasi";

      if (error.code === "ECONNABORTED") {
        errorMessage =
          "Sinkronisasi timeout. Proses mungkin masih berjalan di server.";
      } else if (error.response?.status === 500) {
        errorMessage =
          "Error server: " +
          (error.response.data.message || "Internal Server Error");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotif("error", errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!loading) {
      const options = {
        harian: { date: selectedDate },
        mingguan: selectedWeek,
        bulanan: selectedMonth,
        tahunan: { year: selectedYear },
      };
      setChartData(generateChartData(filterType, options[filterType]));
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

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow-md transition-colors duration-300 ${
              isSyncing
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isSyncing ? (
              <>
                {" "}
                <Loader className="w-5 h-5 animate-spin" />{" "}
                <span>Menyinkronkan...</span>{" "}
              </>
            ) : (
              <>
                {" "}
                <RefreshCw className="w-5 h-5" /> <span>Sinkronkan Data</span>{" "}
              </>
            )}
          </button>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
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
                title="Total Orang Tua"
                value={stats.totalOrangtua}
                icon={<Users size={48} />}
                color="from-green-500 to-green-600"
                link="/orangtua"
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
        <motion.div
          variants={itemVariants}
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
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
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
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {recentGuests.map((guest) => (
                  <motion.tr
                    key={guest.id}
                    variants={itemVariants}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {guest.nama}
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {guest.keperluan}
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-right">
                      {guest.tanggal}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
