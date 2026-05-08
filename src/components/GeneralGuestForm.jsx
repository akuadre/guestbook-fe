// src/components-guestbook/GeneralGuestForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Building,
  MapPin,
  MessageSquare,
  User as UserIcon,
} from "lucide-react";
import { InputField, SelectField } from "./InputField";
import WebcamCapture from "./WebcamCapture";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const GeneralGuestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    kontak: "",
    alamat: "",
    id_pegawai: "",
    keperluan: "",
    foto_tamu: "",
  });

  const [formOptions, setFormOptions] = useState({
    pegawai: [],
  });

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // NEW: Loading state untuk data

  // Load form data dari API
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoadingData(true); // NEW: Set loading true
        const response = await axios.get(`${API_URL}/guestbook/data`);
        if (response.data.success) {
          setFormOptions({
            pegawai: Array.isArray(response.data.data.pegawai) ? 
              response.data.data.pegawai.map((p) => ({
                value: p.id,
                label: p.nama_pegawai,
              })) : [],
          });
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
        setFormOptions({
          pegawai: [],
        });
      } finally {
        setIsLoadingData(false); // NEW: Set loading false
      }
    };

    loadFormData();
  }, []);

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
  };

  const handlePhotoCapture = (photoData) => {
    setFormData((prev) => ({ ...prev, foto_tamu: photoData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        role: "umum",
      };

      const response = await axios.post(
        `${API_URL}/guestbook/store`,
        submitData
      );

      if (response.data.success) {
        alert("✅ Data berhasil disimpan!");
        setFormData({
          nama: "",
          instansi: "",
          kontak: "",
          alamat: "",
          id_pegawai: "",
          keperluan: "",
          foto_tamu: "",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        alert("❌ Gagal menyimpan data: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WebcamCapture onCapture={handlePhotoCapture} />

      {/* SINGLE COLUMN LAYOUT */}
      <div className="space-y-6">
        <InputField
          label="Nama Lengkap"
          id="guestName"
          icon={User}
          placeholder="Nama lengkap Anda"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Nomor Handphone"
          id="guestContact"
          icon={Phone}
          placeholder="Contoh: 081234567890"
          name="kontak"
          value={formData.kontak}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Asal Instansi"
          id="guestCompany"
          icon={Building}
          placeholder="Nama instansi"
          name="instansi"
          value={formData.instansi}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Alamat Instansi"
          id="guestAddress"
          icon={MapPin}
          type="textarea"
          placeholder="Alamat lengkap instansi"
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
            formOptions.pegawai.find((opt) => opt.value === formData.id_pegawai) || null
          }
          onChange={(selected) => handleSelectChange("id_pegawai", selected)}
          isSearchable={true}
          placeholder={isLoadingData ? "Memuat data pegawai..." : "Pilih pegawai yang ingin ditemui"}
          isLoading={isLoadingData} // NEW: Tambah loading indicator
          loadingMessage="Memuat data pegawai..."
          required
        />

        <InputField
          label="Keperluan"
          id="guestPurpose"
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
  );
};

export default GeneralGuestForm;