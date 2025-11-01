import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Search,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  School,
  BookUser,
  Home,
  Briefcase,
  FileText,
  HeartHandshake,
  Banknote,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // URL API Aplikasi Anak
const PHOTO_BASE_URL =
  import.meta.env.VITE_BASE_URL_INDUK || "http://localhost:8001"; // URL Aplikasi Induk untuk foto

// =================================================================
// KOMPONEN-KOMPONEN HELPER (MODAL & NOTIFICATION)
// =================================================================

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Notification = ({ notification, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-sky-500",
  };
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`flex items-center gap-4 text-white p-4 rounded-xl shadow-2xl ${
              colors[notification.type]
            }`}
          >
            {icons[notification.type]}
            <span className="font-medium">{notification.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =================================================================
// KOMPONEN LOADING & DETAIL
// =================================================================

const LoadingTable = ({ rowsPerPage }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full w-full table-auto animate-pulse">
      <thead className="bg-gray-800 text-white text-center">
        <tr>
          <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            No
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            NIS
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
            Nama Siswa
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            JK
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Kelas
          </th>
          <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rowsPerPage)].map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-4 bg-gray-200 rounded mx-auto"
                style={{ width: "30px" }}
              ></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-4 bg-gray-200 rounded mx-auto"
                style={{ width: "60px" }}
              ></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-8 bg-gray-200 rounded mx-auto"
                style={{ width: "80px" }}
              ></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col py-3 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-semibold text-gray-700 mb-1">{label}</dt>
    <dd className="text-sm text-gray-900">
      {value || <span className="text-gray-400">-</span>}
    </dd>
  </div>
);

const DetailSection = ({ title, icon, children }) => (
  <div className="mb-6">
    <h4 className="text-base font-bold text-gray-700 mb-2 flex items-center">
      {icon} <span className="ml-2">{title}</span>
    </h4>
    <dl className="bg-gray-50 p-4 rounded-lg">{children}</dl>
  </div>
);

// MODAL DETAIL YANG SUPER LENGKAP SEPERTI INDUK
const SiswaDetailModal = ({ siswa, onClose, loading }) => {
  if (!siswa && !loading) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Siswa">
      {loading ? (
        <div className="p-8 text-center flex items-center justify-center flex-grow">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[85vh] overflow-y-auto">
          {/* FOTO DAN IDENTITAS UTAMA - SIMPLIFIED */}
          <div className="text-center bg-gray-50 p-6 rounded-xl">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
              <User size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mt-4 text-gray-900">
              {siswa.nama_siswa}
            </h3>
            <p className="text-gray-500">NIS: {siswa.nis}</p>
          </div>

          {/* IDENTITAS SISWA - SESUAI MODEL */}
          <DetailSection
            title="📌 Identitas"
            icon={<User size={18} className="text-blue-500" />}
          >
            <DetailRow label="ID" value={siswa.id} />
            <DetailRow label="NIS" value={siswa.nis} />
            <DetailRow label="Nama Siswa" value={siswa.nama_siswa} />
            <DetailRow 
              label="Jenis Kelamin" 
              value={siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 
                     siswa.jenis_kelamin === 'P' ? 'Perempuan' : siswa.jenis_kelamin} 
            />
            <DetailRow label="Kelas" value={siswa.kelas} />
          </DetailSection>

          {/* KONTAK & ALAMAT - SESUAI MODEL */}
          <DetailSection
            title="📞 Kontak & Alamat"
            icon={<Home size={18} className="text-green-500" />}
          >
            <DetailRow label="Alamat" value={siswa.alamat} />
            <DetailRow label="Kontak" value={siswa.kontak} />
          </DetailSection>

          {/* INFORMASI LAINNYA */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Data detail lengkap tidak tersedia dalam model saat ini.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

// =================================================================
// KOMPONEN UTAMA HALAMAN SISWA
// =================================================================

const Siswa = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const showNotif = (type, text) => setNotification({ type, text });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(async (page, search, perPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/siswa`, {
        params: {
          page,
          search,
          rows_per_page: perPage,
        },
      });

      // Sesuaikan dengan response aktual dari backend
      // Jika backend mengembalikan pagination object langsung
      if (response.data.data) {
        // Jika response sudah memiliki struktur { data: [], current_page, etc }
        setSiswa(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        });
      } else {
        // Jika backend mengembalikan pagination object langsung
        setSiswa(response.data.data || response.data);
        setPagination(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showNotif("error", "Gagal mengambil data siswa dari server.");
      setSiswa([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData(currentPage, debouncedTerm, rowsPerPage);
  }, [currentPage, debouncedTerm, rowsPerPage, fetchData]);

  const handleViewDetail = async (idsiswa) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${API_URL}/siswa/${idsiswa}`);
      if (response.data.success) {
        setSelectedSiswa(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      showNotif("error", "Gagal mengambil detail siswa.");
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSiswa(null);
  };

  const getRowNumber = (index) => {
    if (!pagination) return index + 1;
    return pagination.from + index;
  };

  return (
    <>
      <Notification
        notification={notification}
        onDismiss={() => setNotification(null)}
      />

      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Data Siswa
          </h1>
          <p className="text-gray-500 mt-1">
            Menampilkan data siswa yang telah disinkronkan.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, NIS, atau kelas siswa ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <LoadingTable rowsPerPage={rowsPerPage} />
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                <tr>
                  <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    NIS
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Nama Siswa
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    JK
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siswa.map((s, index) => (
                  <tr key={s.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {s.nis}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      <button
                        onClick={() => handleViewDetail(s.id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                      >
                        {s.nama_siswa}
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {s.jenis_kelamin === "L"
                        ? "L"
                        : s.jenis_kelamin === "P"
                        ? "P"
                        : s.jenis_kelamin}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {s.kelas}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetail(s.id)}
                        className="bg-sky-100 text-sky-800 font-semibold p-2 rounded-lg hover:bg-sky-200 transition flex items-center gap-1 mx-auto"
                      >
                        <Info className="w-4 h-4" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && siswa.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      {debouncedTerm
                        ? "Tidak ada data yang cocok dengan pencarian."
                        : "Tidak ada data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.total > 0 && (
          <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
              <span>Baris per halaman:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-transparent focus:outline-none border rounded-md"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span>
              Menampilkan{" "}
              <strong>
                {pagination.from}-{pagination.to}
              </strong>{" "}
              dari <strong>{pagination.total}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span>
                Hal {pagination.current_page} dari {pagination.last_page}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === pagination.last_page}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <SiswaDetailModal
            siswa={selectedSiswa}
            onClose={closeModal}
            loading={loadingDetail}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Siswa;
