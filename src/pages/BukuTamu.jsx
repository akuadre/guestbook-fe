import React, { useState, useEffect, useCallback } from "react";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  PlusCircle,
  Camera,
  Eye,
  Info,
  Trash2,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ListFilterPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const IMG_URL =
  import.meta.env.VITE_IMG_URL || "http://localhost:8000/uploads/foto_tamu";

// =================================================================
// KOMPONEN HELPER
// =================================================================

const Notification = ({ notification, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <FileText className="w-6 h-6" />,
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

const LoadingTable = ({ rowsPerPage }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full w-full table-auto animate-pulse">
      <thead className="bg-gray-800 text-white text-center">
        <tr>
          <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            No
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Nama Tamu
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Role
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Bertemu Dengan
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Keperluan
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Tanggal
          </th>
          <th className="px-3 py-3 w-20 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rowsPerPage)].map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-4 px-3 text-center">
              <div
                className="h-4 bg-gray-200 rounded mx-auto"
                style={{ width: "30px" }}
              ></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-4 bg-gray-200 rounded mx-auto"
                style={{ width: "60px" }}
              ></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-4 bg-gray-200 rounded mx-auto"
                style={{ width: "120px" }}
              ></div>
            </td>
            <td className="py-4 px-3 text-center">
              <div
                className="h-8 bg-gray-200 rounded mx-auto"
                style={{ width: "60px" }}
              ></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailRow = ({ label, value, icon }) => (
  <div className="flex flex-col py-3 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      {icon}
      {label}
    </dt>
    <dd className="text-sm text-gray-900 ml-6">
      {value || <span className="text-gray-400">-</span>}
    </dd>
  </div>
);

const DetailSection = ({ title, icon, children }) => (
  <div className="mb-6">
    <h4 className="text-base font-bold text-gray-700 mb-2 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h4>
    <dl className="bg-gray-50 p-4 rounded-lg">{children}</dl>
  </div>
);

// Komponen Ikon WhatsApp
const IconWhatsApp = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.6 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.6 0 0 1 4.66 1.931 6.56 6.6 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

// =================================================================
// MODAL DETAIL BUKU TAMU (DENGAN TOMBOL HAPUS)
// =================================================================

const BukuTamuDetailModal = ({ tamu, onClose, loading, onDelete }) => {
  if (!tamu && !loading) return null;

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Kunjungan Tamu">
      {loading ? (
        <div className="p-8 text-center flex items-center justify-center flex-grow">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[85vh] p-6 overflow-y-auto">
          {/* FOTO BESAR HORIZONTAL */}
          <div className="text-center bg-gray-50 p-6 rounded-xl">
            {tamu.foto_tamu ? (
              <div className="flex justify-center">
                <img
                  src={`${IMG_URL}/${tamu.foto_tamu}`}
                  alt={`Foto ${tamu.nama}`}
                  // alt="Foto Tamu"
                  className="w-64 h-48 object-cover rounded-xl shadow-md border-4 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/128x160/e2e8f0/64748b?text=No+Image";
                  }}
                />
              </div>
            ) : (
              <div className="w-64 h-48 bg-gray-200 rounded-xl flex items-center justify-center mx-auto">
                <Camera size={48} className="text-gray-400" />
              </div>
            )}
            <h3 className="text-2xl font-bold mt-4 text-gray-900">
              {tamu.nama}
            </h3>
            <p className="text-gray-500 capitalize">
              {tamu.role === "ortu"
                ? `Orang Tua dari ${tamu.siswa?.nama_siswa || "-"}`
                : tamu.instansi || "Tamu Umum"}
            </p>
          </div>

          {/* INFORMASI TAMU */}
          <DetailSection
            title="Informasi Tamu"
            icon={<User size={18} className="text-blue-500" />}
          >
            <DetailRow
              label="Nama Lengkap"
              value={tamu.nama}
              icon={<User size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Role"
              value={tamu.role === "ortu" ? "Orang Tua" : "Tamu Umum"}
              icon={<Briefcase size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Instansi"
              value={tamu.instansi}
              icon={<GraduationCap size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Kontak"
              value={tamu.kontak}
              icon={<Phone size={16} className="text-gray-400" />}
            />
            {tamu.kontak && (
              <div className="mt-2">
                <a
                  href={`https://wa.me/${formatPhoneNumber(tamu.kontak)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 text-sm"
                >
                  <IconWhatsApp />
                  Chat WhatsApp
                </a>
              </div>
            )}
          </DetailSection>

          {/* ALAMAT */}
          <DetailSection
            title="Alamat"
            icon={<MapPin size={18} className="text-yellow-500" />}
          >
            <DetailRow
              label="Alamat Lengkap"
              value={tamu.alamat}
              icon={<MapPin size={16} className="text-gray-400" />}
            />
          </DetailSection>

          {/* INFORMASI KUNJUNGAN */}
          <DetailSection
            title="Informasi Kunjungan"
            icon={<Calendar size={18} className="text-green-500" />}
          >
            <DetailRow
              label="Bertemu Dengan"
              value={
                tamu.pegawai?.nama_pegawai
                  ? `${tamu.pegawai.nama_pegawai} 
                  ${
                    tamu.pegawai.jabatan?.nama_jabatan
                      ? `(${tamu.pegawai.jabatan.nama_jabatan})`
                      : ""
                  }`
                  : "-"
              }
              icon={<User size={16} className="text-gray-400" />}
            />
            <DetailRow
              label="Keperluan"
              value={tamu.keperluan}
              icon={<FileText size={16} className="text-gray-400" />}
            />
            {tamu?.siswa && (
              <DetailRow
                label="Nama Siswa"
                value={tamu.siswa?.nama_siswa || "-"}
                icon={<GraduationCap size={16} className="text-gray-400" />}
              />
            )}
            <DetailRow
              label="Tanggal Kunjungan"
              value={formatDate(tamu.created_at)}
              icon={<Calendar size={16} className="text-gray-400" />}
            />
          </DetailSection>

          {/* TOMBOL HAPUS DI BAWAH */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button
              onClick={() => onDelete(tamu)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-medium"
            >
              <Trash2 size={20} />
              Hapus Data Kunjungan
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// =================================================================
// MODAL KONFIRMASI HAPUS
// =================================================================

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
    <div className="p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Hapus Data Buku Tamu?
      </h3>
      <p className="text-gray-600 mb-6">
        Apakah Anda yakin ingin menghapus data kunjungan{" "}
        <strong>{data?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </div>
    </div>
  </Modal>
);

// =================================================================
// KOMPONEN UTAMA BUKU TAMU
// =================================================================

const BukuTamu = () => {
  const [bukuTamu, setBukuTamu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const [selectedTamu, setSelectedTamu] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tamuToDelete, setTamuToDelete] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const showNotif = (type, text) => setNotification({ type, text });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(async (page, search, perPage, role, date) => {
    setLoading(true);
    try {
      const params = {
        page,
        search,
        rows_per_page: perPage,
        role: role || undefined,
        date: date || undefined,
      };

      const response = await axios.get(`${API_URL}/bukutamu`, { params });
      setBukuTamu(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      });
    } catch (err) {
      showNotif("error", "Gagal mengambil data buku tamu dari server.");
      setBukuTamu([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, debouncedTerm, rowsPerPage, roleFilter, dateFilter);
  }, [
    currentPage,
    debouncedTerm,
    rowsPerPage,
    roleFilter,
    dateFilter,
    fetchData,
  ]);

  const handleViewDetail = async (id) => {
    setIsDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${API_URL}/bukutamu/${id}`);
      if (response.data.success) {
        setSelectedTamu(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      showNotif("error", "Gagal mengambil detail buku tamu.");
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/bukutamu/${id}`);
      showNotif("success", "Data buku tamu berhasil dihapus.");
      fetchData(currentPage, debouncedTerm, rowsPerPage);
      setIsDetailModalOpen(false); // Tutup modal detail setelah hapus
    } catch (err) {
      showNotif("error", "Gagal menghapus data buku tamu.");
    } finally {
      setIsDeleteModalOpen(false);
      setTamuToDelete(null);
    }
  };

  const confirmDelete = (tamu) => {
    setTamuToDelete(tamu);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteFromDetail = (tamu) => {
    confirmDelete(tamu);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTamu(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTamuToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getRowNumber = (index) => {
    if (!pagination) return index + 1;
    return pagination.from + index;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ortu":
        return "Orang Tua";
      case "umum":
        return "Tamu Umum";
      default:
        return role;
    }
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
            Manajemen Buku Tamu
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan lihat daftar kunjungan tamu di halaman ini.
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Filter Role */}
            <div className="relative w-full md:w-64">
              <ListFilterPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition appearance-none"
              >
                <option value="">Semua Role</option>
                <option value="ortu">Orang Tua</option>
                <option value="umum">Tamu Umum</option>
              </select>
            </div>

            {/* Filter Tanggal - TAMBAHAN BARU */}
            <div className="relative w-full md:w-64">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-90">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama tamu, keperluan, atau kontak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || roleFilter || dateFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <X size={16} />
                Hapus Filter
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTERS INFO */}
        {(roleFilter || searchTerm || dateFilter) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <ListFilterPlus size={16} />
              <span>Filter Aktif:</span>
              {roleFilter && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs font-medium">
                  Role: {getRoleLabel(roleFilter)}
                </span>
              )}
              {dateFilter && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs font-medium">
                  Tanggal: {formatDateForDisplay(dateFilter)}
                </span>
              )}
              {searchTerm && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs font-medium">
                  Pencarian: "{searchTerm}"
                </span>
              )}
            </div>
          </div>
        )}

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
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Nama Tamu
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Bertemu Dengan
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Keperluan
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-3 py-3 w-20 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bukuTamu.map((tamu, index) => (
                  <tr key={tamu.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      <button
                        onClick={() => handleViewDetail(tamu.id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                      >
                        {tamu.nama}
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tamu.role === "ortu"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {tamu.role === "ortu" ? "👨‍👩‍👧‍👦 Orang Tua" : "👥 Tamu Umum"}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-left">
                      {tamu.pegawai?.nama_pegawai
                        ? `${tamu.pegawai.nama_pegawai}
                        ${
                          tamu.pegawai.jabatan?.nama_jabatan
                            ? ` (${tamu.pegawai.jabatan.nama_jabatan})`
                            : ""
                        }`
                        : "-"}
                    </td>
                    <td className="px-3 py-3 whitespace-normal max-w-xs">
                      {tamu.keperluan}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {formatDate(tamu.created_at)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewDetail(tamu.id)}
                          className="bg-sky-100 text-sky-800 font-semibold p-2 rounded-lg hover:bg-sky-200 transition flex items-center gap-1"
                        >
                          {/* <Eye className="w-4 h-4" /> */}
                          <Info className="w-4 h-4" /> Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && bukuTamu.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      {debouncedTerm
                        ? "Tidak ada data yang cocok dengan filter yang dipilih."
                        : "Tidak ada data buku tamu."}
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

      {/* MODAL DETAIL DENGAN TOMBOL HAPUS */}
      <AnimatePresence>
        {isDetailModalOpen && (
          <BukuTamuDetailModal
            tamu={selectedTamu}
            onClose={closeDetailModal}
            loading={loadingDetail}
            onDelete={handleDeleteFromDetail}
          />
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(tamuToDelete.id)}
            data={tamuToDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BukuTamu;
