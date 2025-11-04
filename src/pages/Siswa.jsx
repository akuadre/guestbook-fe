import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import {
  Search,
  Info,
  X,
  User,
  Home,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  ListFilterPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// =================================================================
// KOMPONEN-KOMPONEN HELPER (NOTIFICATION)
// =================================================================

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
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999]"
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
            Jenis Kelamin
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
                style={{ width: "80px" }}
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
const SiswaDetailModal = ({ siswa, onClose, loading, onEdit, onDelete }) => {
  if (!siswa && !loading) return null;

  // Fungsi untuk format nomor WhatsApp
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Siswa">
      {loading ? (
        <div className="p-8 text-center flex items-center justify-center flex-grow">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[85vh] p-6 overflow-y-auto">
          {/* FOTO DAN IDENTITAS UTAMA - SIMPLIFIED */}
          <div className="text-center bg-gray-50 p-6 rounded-xl relative">
            {/* FLOATING ACTION BUTTONS - POSISI STRATEGIS */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => onEdit(siswa)}
                className="bg-yellow-500 text-white p-2.5 rounded-lg hover:bg-yellow-600 transition shadow-lg"
                title="Edit Data"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(siswa)}
                className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition shadow-lg"
                title="Hapus Data"
              >
                <Trash2 size={18} />
              </button>
            </div>

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
              value={
                siswa.jenis_kelamin === "L"
                  ? "Laki-laki"
                  : siswa.jenis_kelamin === "P"
                  ? "Perempuan"
                  : siswa.jenis_kelamin
              }
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

          {/* TOMBOL WHATSAPP */}
          {siswa.kontak && (
            <div className="text-center">
              <a
                href={`https://wa.me/${formatPhoneNumber(siswa.kontak)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 font-medium text-lg shadow-lg"
              >
                <IconWhatsApp />
                Hubungi via WhatsApp
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Klik tombol di atas untuk menghubungi {siswa.nama_siswa} via
                WhatsApp
              </p>
            </div>
          )}

          {/* PESAN JIKA TIDAK ADA KONTAK */}
          {!siswa.kontak && (
            <div className="text-center bg-gray-100 p-4 rounded-lg">
              <IconWhatsApp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                Nomor kontak tidak tersedia untuk siswa ini.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

const TambahSiswaModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  formData,
  onFormChange,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Siswa Baru">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* NIS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIS <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nis"
            value={formData.nis}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan NIS"
          />
        </div>

        {/* Nama Siswa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Siswa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_siswa"
            value={formData.nama_siswa}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama lengkap siswa"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kelas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kelas"
            value={formData.kelas}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Contoh: X RPL A, XI MEKA B"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={onFormChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan alamat lengkap"
          />
        </div>

        {/* Kontak */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontak
          </label>
          <input
            type="text"
            name="kontak"
            value={formData.kontak}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Nomor telepon/WhatsApp"
          />
        </div>

        {/* Tombol Action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Plus size={16} />
                Simpan
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// MODAL EDIT SISWA
const EditSiswaModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  formData,
  onFormChange,
  siswa,
}) => {
  if (!isOpen || !siswa) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, siswa.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Data Siswa">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* NIS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIS <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nis"
            value={formData.nis}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan NIS"
          />
        </div>

        {/* Nama Siswa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Siswa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_siswa"
            value={formData.nama_siswa}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama lengkap siswa"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kelas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kelas"
            value={formData.kelas}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Contoh: X RPL A, XI MEKA B"
          />
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={onFormChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan alamat lengkap"
          />
        </div>

        {/* Kontak */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontak
          </label>
          <input
            type="text"
            name="kontak"
            value={formData.kontak}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Nomor telepon/WhatsApp"
          />
        </div>

        {/* Tombol Action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={16} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// MODAL KONFIRMASI HAPUS
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  loading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
    <div className="p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Hapus Data Siswa?
      </h3>
      <p className="text-gray-600 mb-6">
        Apakah Anda yakin ingin menghapus data siswa{" "}
        <strong>{data?.nama_siswa}</strong> (NIS: {data?.nis})? Tindakan ini
        tidak dapat dibatalkan.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Menghapus...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Hapus
            </>
          )}
        </button>
      </div>
    </div>
  </Modal>
);

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
  const [selectedKelas, setSelectedKelas] = useState("");

  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nis: "",
    nama_siswa: "",
    jenis_kelamin: "",
    kelas: "",
    alamat: "",
    kontak: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // TAMBAHKAN DI SINI: Fungsi reset form terpusat
  const resetForm = () => {
    setFormData({
      nis: "",
      nama_siswa: "",
      jenis_kelamin: "",
      kelas: "",
      alamat: "",
      kontak: "",
    });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [siswaToEdit, setSiswaToEdit] = useState(null);
  const [siswaToDelete, setSiswaToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const showNotif = (type, text) => setNotification({ type, text });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(async (page, search, perPage, kelas) => {
    setLoading(true);
    try {
      const params = {
        page,
        search,
        rows_per_page: perPage,
        ...(kelas && { kelas }), // Tambahkan filter kelas ke params
      };

      const response = await axios.get(`${API_URL}/siswa`, { params });

      if (response.data.success) {
        setSiswa(response.data.data);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        });
      } else {
        setSiswa(response.data.data || []);
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
    fetchData(currentPage, debouncedTerm, rowsPerPage, selectedKelas);
  }, [currentPage, debouncedTerm, rowsPerPage, selectedKelas, fetchData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi untuk handle close modal tambah
  const handleCloseTambahModal = () => {
    setIsTambahModalOpen(false);
    resetForm();
  };

  // Fungsi untuk handle close modal edit
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSiswaToEdit(null);
    resetForm();
  };

  const handleTambahSiswa = async (data) => {
    setLoadingSubmit(true);
    try {
      const response = await axios.post(`${API_URL}/siswa`, data);

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Siswa berhasil ditambahkan!"
        );
        setIsTambahModalOpen(false);
        resetForm();
        // Refresh data
        fetchData(currentPage, debouncedTerm, rowsPerPage, selectedKelas);
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        // Ambil error pertama untuk ditampilkan
        const firstError = Object.values(errors)[0][0];
        showNotif("error", firstError);
      } else {
        // HANDLING ERROR LAINNYA
        const errorMessage =
          err.response?.data?.message || "Gagal menambah siswa";
        showNotif("error", errorMessage);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

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

  // Fungsi untuk handle edit
  const handleEditSiswa = (siswa) => {
    setSiswaToEdit(siswa);
    setFormData({
      nis: siswa.nis,
      nama_siswa: siswa.nama_siswa,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas: siswa.kelas,
      alamat: siswa.alamat || "",
      kontak: siswa.kontak || "",
    });
    setIsEditModalOpen(true);
  };

  // Fungsi untuk handle update
  const handleUpdateSiswa = async (data, id) => {
    setLoadingEdit(true);
    try {
      const response = await axios.put(`${API_URL}/siswa/${id}`, data);

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Data siswa berhasil diupdate!"
        );
        setIsEditModalOpen(false);
        setSiswaToEdit(null);
        resetForm();
        // Refresh data
        fetchData(currentPage, debouncedTerm, rowsPerPage, selectedKelas);
        // Tutup modal detail juga
        setIsModalOpen(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal mengupdate siswa";
      showNotif("error", errorMessage);
    } finally {
      setLoadingEdit(false);
    }
  };

  // Fungsi untuk handle delete
  const handleDeleteSiswa = (siswa) => {
    setSiswaToDelete(siswa);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk konfirmasi hapus
  const confirmDeleteSiswa = async () => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${API_URL}/siswa/${siswaToDelete.id}`
      );

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Siswa berhasil dihapus!"
        );
        setIsDeleteModalOpen(false);
        setSiswaToDelete(null);
        // Refresh data
        fetchData(currentPage, debouncedTerm, rowsPerPage, selectedKelas);
        // Tutup modal detail juga
        setIsModalOpen(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menghapus siswa";
      showNotif("error", errorMessage);
    } finally {
      setLoadingDelete(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSiswa(null);
  };

  const handleKelasChange = (e) => {
    setSelectedKelas(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedKelas("");
    setSearchTerm("");
    setCurrentPage(1);
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
            Kelola dan lihat data siswa di halaman ini.
          </p>
        </div>

        {/* FILTER SECTION - SEPERTI BUKU TAMU */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Filter Kelas */}
            <div className="relative w-full md:w-64">
              <ListFilterPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedKelas}
                onChange={handleKelasChange}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition appearance-none"
              >
                <option value="">Semua Kelas</option>
                <option value="X">Kelas X (10)</option>
                <option value="XI">Kelas XI (11)</option>
                <option value="XII">Kelas XII (12)</option>
              </select>
            </div>

            {/* Search Input */}
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

            {/* Clear Filters Button */}
            {(selectedKelas || searchTerm) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <X size={16} />
                Hapus Filter
              </button>
            )}
          </div>

          {/* Tombol Tambah - Paling Kanan */}
          <button
            onClick={() => setIsTambahModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Tambah Siswa
          </button>
        </div>

        {/* Active Filters Info */}
        {(selectedKelas || searchTerm) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <ListFilterPlus size={16} />
              <span>Filter Aktif:</span>
              {selectedKelas && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                  Kelas: {selectedKelas}
                </span>
              )}
              {searchTerm && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs">
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
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    NIS
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Nama Siswa
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Jenis Kelamin
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
                        ? "Laki-laki"
                        : s.jenis_kelamin === "P"
                        ? "Perempuan"
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
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      {debouncedTerm || selectedKelas
                        ? "Tidak ada data yang cocok dengan filter yang dipilih."
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

      {/* MODAL TAMBAH SISWA */}
      <AnimatePresence>
        {isTambahModalOpen && (
          <TambahSiswaModal
            isOpen={isTambahModalOpen}
            onClose={handleCloseTambahModal}
            onSubmit={handleTambahSiswa}
            loading={loadingSubmit}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <SiswaDetailModal
            siswa={selectedSiswa}
            onClose={closeModal}
            loading={loadingDetail}
            onEdit={handleEditSiswa}
            onDelete={handleDeleteSiswa}
          />
        )}
      </AnimatePresence>

      {/* MODAL EDIT SISWA */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditSiswaModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateSiswa}
            loading={loadingEdit}
            formData={formData}
            onFormChange={handleFormChange}
            siswa={siswaToEdit}
          />
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSiswaToDelete(null);
            }}
            onConfirm={confirmDeleteSiswa}
            data={siswaToDelete}
            loading={loadingDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Siswa;
