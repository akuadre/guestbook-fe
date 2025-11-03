import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import {
  Search,
  Info,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// =================================================================
// KOMPONEN-KOMPONEN HELPER
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
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
            Nama Jabatan
          </th>
          <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rowsPerPage)].map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-4 px-3 text-center">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="py-4 px-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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

// MODAL TAMBAH JABATAN
const TambahJabatanModal = ({
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
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Jabatan Baru">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nama Jabatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_jabatan"
            value={formData.nama_jabatan}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama jabatan"
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

// MODAL EDIT JABATAN
const EditJabatanModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  formData,
  onFormChange,
  jabatan,
}) => {
  if (!isOpen || !jabatan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, jabatan.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Data Jabatan">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nama Jabatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_jabatan"
            value={formData.nama_jabatan}
            onChange={onFormChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama jabatan"
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
        Hapus Data Jabatan?
      </h3>
      <p className="text-gray-600 mb-6">
        Apakah Anda yakin ingin menghapus data jabatan{" "}
        <strong>{data?.nama_jabatan}</strong>? Tindakan ini tidak dapat
        dibatalkan.
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
// KOMPONEN UTAMA HALAMAN JABATAN
// =================================================================

const Jabatan = () => {
  const [jabatanList, setJabatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // State untuk CRUD operations
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jabatanToEdit, setJabatanToEdit] = useState(null);
  const [jabatanToDelete, setJabatanToDelete] = useState(null);

  const [formData, setFormData] = useState({
    nama_jabatan: "",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const resetForm = () => {
    setFormData({
      nama_jabatan: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      const params = {
        page,
        search,
        rows_per_page: perPage,
      };

      const response = await axios.get(`${API_URL}/jabatan`, { params });

      if (response.data.success) {
        setJabatanList(response.data.data || []);
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        });
      } else {
        setJabatanList(response.data.data || []);
        setPagination(response.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showNotif("error", "Gagal mengambil data jabatan dari server.");
      setJabatanList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, debouncedTerm, rowsPerPage);
  }, [currentPage, debouncedTerm, rowsPerPage, fetchData]);

  const handleTambahJabatan = async (data) => {
    setLoadingSubmit(true);
    try {
      const response = await axios.post(`${API_URL}/jabatan`, data);

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Jabatan berhasil ditambahkan!"
        );
        setIsTambahModalOpen(false);
        resetForm();
        fetchData(currentPage, debouncedTerm, rowsPerPage);
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        showNotif("error", firstError);
      } else {
        const errorMessage =
          err.response?.data?.message || "Gagal menambah jabatan";
        showNotif("error", errorMessage);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEditJabatan = async (data, id) => {
    setLoadingEdit(true);
    try {
      const response = await axios.put(`${API_URL}/jabatan/${id}`, data);

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Data jabatan berhasil diupdate!"
        );
        setIsEditModalOpen(false);
        setJabatanToEdit(null);
        resetForm();
        fetchData(currentPage, debouncedTerm, rowsPerPage);
      }
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        showNotif("error", firstError);
      } else {
        const errorMessage =
          err.response?.data?.message || "Gagal mengupdate jabatan";
        showNotif("error", errorMessage);
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteJabatan = (jabatan) => {
    setJabatanToDelete(jabatan);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteJabatan = async () => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${API_URL}/jabatan/${jabatanToDelete.id}`
      );

      if (response.data.success) {
        showNotif(
          "success",
          response.data.message || "Jabatan berhasil dihapus!"
        );
        setIsDeleteModalOpen(false);
        setJabatanToDelete(null);
        fetchData(currentPage, debouncedTerm, rowsPerPage);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Gagal menghapus jabatan";
      showNotif("error", errorMessage);
    } finally {
      setLoadingDelete(false);
    }
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
            Manajemen Data Jabatan
          </h1>
          <p className="text-gray-500 mt-1">
            Menampilkan data jabatan yang tersedia.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama jabatan ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
            </div>

            {/* Clear Filters Button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <X size={16} />
                Hapus Pencarian
              </button>
            )}
          </div>

          {/* Tombol Tambah - Paling Kanan */}
          <button
            onClick={() => setIsTambahModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Tambah Jabatan
          </button>
        </div>

        {/* Active Filters Info */}
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Search size={16} />
              <span>Pencarian Aktif:</span>
              <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                "{searchTerm}"
              </span>
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
                    Nama Jabatan
                  </th>
                  <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jabatanList.map((j, index) => (
                  <tr key={j.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      {j.nama_jabatan}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setJabatanToEdit(j);
                            setFormData({
                              nama_jabatan: j.nama_jabatan,
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-lg hover:bg-yellow-200 transition flex items-center gap-1 text-xs"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJabatan(j)}
                          className="bg-red-100 text-red-800 font-semibold px-3 py-1 rounded-lg hover:bg-red-200 transition flex items-center gap-1 text-xs"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && jabatanList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      {debouncedTerm
                        ? "Tidak ada data yang cocok dengan pencarian."
                        : "Tidak ada data jabatan."}
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

      {/* MODAL TAMBAH JABATAN */}
      <AnimatePresence>
        {isTambahModalOpen && (
          <TambahJabatanModal
            isOpen={isTambahModalOpen}
            onClose={() => {
              setIsTambahModalOpen(false);
              resetForm();
            }}
            onSubmit={handleTambahJabatan}
            loading={loadingSubmit}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )}
      </AnimatePresence>

      {/* MODAL EDIT JABATAN */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditJabatanModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setJabatanToEdit(null);
              resetForm();
            }}
            onSubmit={handleEditJabatan}
            loading={loadingEdit}
            formData={formData}
            onFormChange={handleFormChange}
            jabatan={jabatanToEdit}
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
              setJabatanToDelete(null);
            }}
            onConfirm={confirmDeleteJabatan}
            data={jabatanToDelete}
            loading={loadingDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Jabatan;