import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Edit,
  Trash2,
  PlusCircle,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const API_URL = `${API_BASE}/jabatan`;

// Impor komponen reusable
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import FormInput from "../components/FormInput";

const Jabatan = () => {
  const [jabatan, setJabatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterText, setFilterText] = useState("");

  // State Modal yang disederhanakan
  const [modalState, setModalState] = useState({ type: null, data: null }); // type: 'add', 'edit', 'delete'

  // State Notifikasi
  const [notification, setNotification] = useState(null); // { type: 'success', text: 'Pesan' }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const showNotif = (type, text) => {
    setNotification({ type, text });
  };

  const fetchJabatan = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);

      // Ambil array data dari respons Laravel (biasanya res.data.data)
      // const rawData = Array.isArray(res.data) ? res.data : res.data.data;
      const rawData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const dataWithNo = rawData.map((item, index) => ({
        ...item,
        no: page * rowsPerPage + index + 1,
      }));

      setJabatan(dataWithNo);
    } catch (err) {
      console.error(err);
      showNotif("error", "Gagal memuat data jabatan.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return jabatan.filter((item) =>
      item.nama_jabatan.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [jabatan, filterText]);

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const closeModal = () => setModalState({ type: null, data: null });

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = Object.fromEntries(new FormData(e.target));

      if (actionType === "Tambah") {
        await axios.post(API_URL, formData);
        showNotif("success", "Data jabatan berhasil ditambahkan!");
      } else if (actionType === "Edit") {
        await axios.put(`${API_URL}/${modalState.data.id}`, formData);
        showNotif("success", "Data jabatan berhasil diperbarui!");
      }

      closeModal();
      fetchJabatan(); // Refresh tabel
    } catch (err) {
      console.error(err);
      showNotif("error", "Gagal menyimpan data jabatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await axios.delete(`${API_URL}/${modalState.data.id}`);
      showNotif(
        "success",
        `Data ${modalState.data.nama_jabatan} berhasil dihapus.`
      );
      closeModal();
      fetchJabatan();
    } catch (err) {
      console.error(err);
      showNotif("error", "Gagal menghapus data jabatan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            <th className="w-14 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
              No
            </th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
              Nama Jabatan
            </th>
            <th className="w-32 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  useEffect(() => {
    fetchJabatan();
  }, []);

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
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Data Jabatan
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola daftar jabatan di halaman ini.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari jabatan..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
          <button
            onClick={() => setModalState({ type: "add", data: null })}
            className="bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-sky-200 hover:shadow-xl w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Tambah Jabatan</span>
          </button>
        </div>

        {loading ? (
          <LoadingTable />
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                <tr>
                  <th className="w-14 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-center">
                    Nama Jabatan
                  </th>
                  <th className="w-32 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.map((j, index) => (
                  <tr key={j.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900 text-center">
                      {j.nama_jabatan}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => setModalState({ type: "edit", data: j })}
                        className="bg-amber-100 text-amber-800 font-semibold p-2 rounded-lg hover:bg-amber-200 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setModalState({ type: "delete", data: j })
                        }
                        className="bg-red-100 text-red-800 font-semibold p-2 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 bg-transparent focus:outline-none border rounded-md"
            >
              <option value={5}>5</option> <option value={10}>10</option>{" "}
              <option value={25}>25</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span>
              Hal {page + 1} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- MODAL TAMBAH DATA --- */}
      <Modal
        isOpen={modalState.type === "add"}
        onClose={closeModal}
        title="Tambah Jabatan Baru"
      >
        <form onSubmit={(e) => handleFormSubmit(e, "Tambah")}>
          <FormInput
            label="Nama Jabatan"
            id="nama_jabatan_add"
            name="nama_jabatan"
            placeholder="Contoh: Bendahara Sekolah"
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2"
            >
              {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL EDIT DATA --- */}
      <Modal
        isOpen={modalState.type === "edit"}
        onClose={closeModal}
        title={`Edit Jabatan: ${modalState.data?.nama_jabatan}`}
      >
        {modalState.data && (
          <form onSubmit={(e) => handleFormSubmit(e, "Edit")}>
            <FormInput
              label="Nama Jabatan"
              id="nama_jabatan_edit"
              name="nama_jabatan"
              defaultValue={modalState.data.nama_jabatan}
              required
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      <Modal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Konfirmasi Hapus Data"
      >
        {modalState.data && (
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              Apakah Anda benar-benar yakin ingin menghapus jabatan
              <br />
              <span className="font-bold text-gray-900">
                {modalState.data.nama_jabatan}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2"
              >
                {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Jabatan;
