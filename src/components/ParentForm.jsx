// src/components-guestbook/ParentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  User as UserIcon,
  UserCheck,
  MessageSquare,
  BookOpen,
  Users,
  Loader,
} from "lucide-react";
import { InputField, SelectField } from "./InputField";
import WebcamCapture from "./WebcamCapture";
import Notification from "./Notification";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ParentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    idsiswa: "",
    kontak: "",
    alamat: "",
    id_pegawai: "",
    keperluan: "",
    foto_tamu: "",
  });

  const [formOptions, setFormOptions] = useState({
    siswa: [],
    pegawai: [],
  });

  const [siswaData, setSiswaData] = useState({
    nis: "",
    nisn: "",
    kelas: "-",
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // NEW: Loading state untuk data
  const [notification, setNotification] = useState(null);

  // Load form data dari API
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get(`${API_URL}/guestbook/data`);
        console.log("API Response:", response.data);

        if (response.data.success) {
          setFormOptions({
            siswa: Array.isArray(response.data.data.siswa)
              ? response.data.data.siswa.map((s) => ({
                  value: s.value || s.id,
                  label: `${s.nis || "-"} | ${s.label || s.nama_siswa}`,
                  nis: s.nis,
                  nisn: s.nisn,
                  kelas: s.kelas,
                  namaSiswa: s.label || s.nama_siswa,
                }))
              : [],
            pegawai: Array.isArray(response.data.data.pegawai)
              ? response.data.data.pegawai.map((p) => ({
                  value: p.id,
                  label: p.nama_pegawai,
                }))
              : [],
          });
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
        setFormOptions({
          siswa: [],
          pegawai: [],
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFormData();
  }, []);

  // Load data siswa tambahan ketika siswa berubah
  useEffect(() => {
    if (formData.idsiswa) {
      const selectedSiswa = formOptions.siswa.find(
        (s) => s.value == formData.idsiswa,
      );

      if (selectedSiswa) {
        setSiswaData({
          nis: selectedSiswa.nis || "",
          nisn: selectedSiswa.nisn || "",
          kelas: selectedSiswa.kelas || "-",
        });
      }

      setFormData((prev) => ({
        ...prev,
        kontak: "",
        alamat: "",
      }));
    } else {
      setSiswaData({ nis: "", nisn: "", kelas: "-" });
      setFormData((prev) => ({
        ...prev,
        kontak: "",
        alamat: "",
      }));
    }
  }, [formData.idsiswa, formOptions.siswa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));

    if (name === "idsiswa" && selectedOption) {
      const selectedSiswa = formOptions.siswa.find(
        (s) => s.value == selectedOption.value,
      );
      if (selectedSiswa) {
        setSiswaData({
          nis: selectedSiswa.nis || "",
          nisn: selectedSiswa.nisn || "",
          kelas: selectedSiswa.kelas || "-",
        });

        setFormData((prev) => ({
          ...prev,
          kontak: "",
          alamat: "",
        }));
      }
    }
  };

  const handlePhotoCapture = (photoData) => {
    setFormData((prev) => ({ ...prev, foto_tamu: photoData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        nama: formData.nama,
        siswa_id: formData.idsiswa,
        kontak: formData.kontak,
        alamat: formData.alamat,
        pegawai_id: formData.id_pegawai,
        keperluan: formData.keperluan,
        foto_tamu: formData.foto_tamu,
        role: "ortu",
      };

      const response = await axios.post(
        `${API_URL}/guestbook/store`,
        submitData,
      );

      if (response.data.success) {
        setNotification({ type: "success", text: "Data berhasil disimpan!" });
        setFormData({
          nama: "",
          idsiswa: "",
          kontak: "",
          alamat: "",
          id_pegawai: "",
          keperluan: "",
          foto_tamu: "",
        });
        setSiswaData({ nis: "", nisn: "", kelas: "-" });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setNotification({ type: "error", text: "Gagal menyimpan data: " + response.data.message });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification({ type: "error", text: "Terjadi kesalahan saat menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  const formatOptionLabel = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <>
      <Notification notification={notification} onDismiss={() => setNotification(null)} />
      <form onSubmit={handleSubmit} className="space-y-6">
      <WebcamCapture onCapture={handlePhotoCapture} />

      {/* SINGLE COLUMN LAYOUT */}
      <div className="space-y-6">
        <SelectField
          label="Orang Tua dari Siswa"
          icon={UserCheck}
          options={formOptions.siswa}
          value={
            formOptions.siswa.find((opt) => opt.value == formData.idsiswa) ||
            null
          }
          onChange={(selected) => handleSelectChange("idsiswa", selected)}
          isSearchable={true}
          formatOptionLabel={formatOptionLabel}
          placeholder={
            isLoadingData
              ? "Memuat data siswa..."
              : "Cari dengan NIS atau nama siswa..."
          }
          isLoading={isLoadingData} // NEW: Tambah loading indicator
          loadingMessage="Memuat data siswa..."
          required
        />

        {/* INFO SISWA - POSISI DI ATAS NAMA ORANG TUA */}
        {(siswaData.nis || siswaData.nisn || siswaData.kelas !== "-") && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-blue-800 text-lg border-b border-blue-200 pb-2">
              Informasi Siswa
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-blue-700 mb-1">
                    NIS
                  </label>
                  <div className="relative">
                    <BookOpen
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                      size={16}
                    />
                    <input
                      type="text"
                      value={siswaData.nis}
                      className="w-full pl-10 pr-4 py-2 border border-blue-300 bg-white rounded-lg text-blue-700 font-medium"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-blue-700 mb-1">
                    Kelas Siswa
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                      size={16}
                    />
                    <input
                      type="text"
                      value={siswaData.kelas}
                      className="w-full pl-10 pr-4 py-2 border border-blue-300 bg-white rounded-lg text-blue-700 font-medium"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAMA ORANG TUA - POSISI DI BAWAH INFO SISWA */}
        <InputField
          label="Nama Orang Tua / Wali Yang Hadir"
          id="namaOrtu"
          icon={User}
          placeholder="Masukkan nama lengkap"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Nomor Handphone"
          id="kontakOrtu"
          type="number"
          icon={Phone}
          placeholder="Contoh: 081234567890"
          name="kontak"
          value={formData.kontak}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Alamat"
          id="alamatOrtu"
          icon={MapPin}
          type="textarea"
          placeholder="Masukkan alamat lengkap"
          name="alamat"
          value={formData.alamat}
          onChange={handleInputChange}
          required
        />

        <SelectField
          label="Bertemu Dengan"
          icon={UserIcon}
          options={formOptions.pegawai}
          value={
            formOptions.pegawai.find(
              (opt) => opt.value == formData.id_pegawai,
            ) || null
          }
          onChange={(selected) => handleSelectChange("id_pegawai", selected)}
          isSearchable={true}
          placeholder={
            isLoadingData
              ? "Memuat data pegawai..."
              : "Pilih pegawai yang ingin ditemui"
          }
          isLoading={isLoadingData} // NEW: Tambah loading indicator
          loadingMessage="Memuat data pegawai..."
          required
        />

        <InputField
          label="Keperluan"
          id="keperluan"
          icon={MessageSquare}
          type="textarea"
          placeholder="Tuliskan keperluan Anda dengan jelas..."
          name="keperluan"
          value={formData.keperluan}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          className="w-full sm:w-auto text-center bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-lg transition hover:bg-slate-300"
          onClick={() => navigate("/")}
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading || !formData.foto_tamu || isLoadingData} // NEW: Disable jika masih loading data
          className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-sky-500/30 transition hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Kirim Data"}
        </button>
      </div>
    </form>
    </>
  );
};

export default ParentForm;
