import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  Trash2,
  PlusCircle,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../components/Modal";
import Notification from "../components/Notification";
import FormInput from "../components/FormInput";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const API_URL = `${API_BASE}/orangtua`;

const OrangTua = () => {
  const [orangTua, setOrangTua] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [notification, setNotification] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const showNotif = (type, text) => setNotification({ type, text });

  const fetchOrangTua = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const rawData = Array.isArray(res.data) ? res.data : res.data.data;
      const dataWithNo = rawData.map((item, index) => ({
        ...item,
        no: index + 1,
      }));
      setOrangTua(dataWithNo);
    } catch (err) {
      console.error(err);
      showNotif("error", "Gagal memuat data orang tua.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrangTua();
  }, []);

  const filteredItems = useMemo(() => {
    return orangTua.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
  }, [orangTua, filterText]);

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const closeModal = () => setModalState({ type: null, data: null });

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = Object.fromEntries(new FormData(e.target));

    try {
      if (actionType === "Tambah") {
        await axios.post(API_URL, formData);
        showNotif("success", "Data orang tua berhasil ditambahkan!");
      } else {
        await axios.put(`${API_URL}/${modalState.data.id}`, formData);
        showNotif("success", "Data orang tua berhasil diperbarui!");
      }
      closeModal();
      fetchOrangTua();
    } catch (err) {
      console.error(err);
      showNotif("error", "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await axios.delete(`${API_URL}/${modalState.data.id}`);
      showNotif(
        "success",
        `Data ${modalState.data.nama_ortu} berhasil dihapus.`
      );
      closeModal();
      fetchOrangTua();
    } catch (err) {
      console.error(err);
      showNotif("error", "Gagal menghapus data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            {[
              "No",
              "Nama Orang Tua",
              "JK",
              "Nama Siswa",
              "Kontak",
              "Alamat",
              "Aksi",
            ].map((h, i) => (
              <th
                key={i}
                className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              {[...Array(7)].map((__, i) => (
                <td key={i} className="py-4 px-3">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
            Manajemen Data Orang Tua
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola daftar orang tua siswa di halaman ini.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari orang tua..."
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
            <span>Tambah Data Ortu</span>
          </button>
        </div>

        {loading ? (
          <LoadingTable />
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                <tr>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Nama Orang Tua
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    JK
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Nama Siswa
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.map((ortu, index) => (
                  <tr key={ortu.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 text-center">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">
                      {ortu.nama_ortu}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {ortu.jenis_kelamin}
                    </td>
                    <td className="px-3 py-3">
                      {ortu.siswa?.namasiswa || "-"}
                    </td>
                    <td className="px-3 py-3">{ortu.kontak}</td>
                    <td className="px-3 py-3">{ortu.alamat}</td>
                    <td className="px-3 py-3 text-center space-x-2">
                      <button
                        onClick={() =>
                          setModalState({ type: "edit", data: ortu })
                        }
                        className="bg-amber-100 text-amber-800 font-semibold p-2 rounded-lg hover:bg-amber-200 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setModalState({ type: "delete", data: ortu })
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

        {/* Pagination */}
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
              <option value={5}>5</option>
              <option value={10}>10</option>
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

      {/* MODAL TAMBAH */}
      <Modal
        isOpen={modalState.type === "add"}
        onClose={closeModal}
        title="Tambah Data Orang Tua"
      >
        <form
          onSubmit={(e) => handleFormSubmit(e, "Tambah")}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div className="md:col-span-2">
            <FormInput label="Nama Orang Tua" name="nama_ortu" required />
          </div>
          <FormInput label="Kontak (HP)" name="kontak" />
          <div className="md:col-span-2">
            <FormInput label="Alamat" name="alamat" required />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
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

      {/* MODAL EDIT */}
      <Modal
        isOpen={modalState.type === "edit"}
        onClose={closeModal}
        title={`Edit Data: ${modalState.data?.nama_ortu}`}
      >
        {modalState.data && (
          <form
            onSubmit={(e) => handleFormSubmit(e, "Edit")}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
          >
            <div className="md:col-span-2">
              <FormInput
                label="Nama Orang Tua"
                name="nama_ortu"
                defaultValue={modalState.data.nama_ortu}
                required
              />
            </div>
            <FormInput
              label="Kontak (HP)"
              name="kontak"
              defaultValue={modalState.data.kontak}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Alamat"
                name="alamat"
                defaultValue={modalState.data.alamat}
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
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

      {/* MODAL HAPUS */}
      <Modal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Konfirmasi Hapus Data"
      >
        {modalState.data && (
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              Apakah Anda yakin ingin menghapus data
              <br />
              <span className="font-bold text-gray-900">
                {modalState.data.nama_ortu}
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

export default OrangTua;
