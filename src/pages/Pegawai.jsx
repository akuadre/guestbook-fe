import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Info, X, ChevronLeft, ChevronRight, User, School, BookUser, Home, Briefcase, FileText, HeartHandshake, Banknote, ShieldCheck, CheckCircle, AlertTriangle, XCircle, Award, GraduationCap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // URL API Aplikasi Anak
const PHOTO_BASE_URL = import.meta.env.VITE_BASE_URL_INDUK  || "http://localhost:8001"; // URL Aplikasi Induk untuk foto

// =================================================================
// KOMPONEN-KOMPONEN HELPER (SUDAH DIGABUNG)
// =================================================================

const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"><X size={24} /></button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const Notification = ({ notification, onDismiss }) => {
    const icons = { success: <CheckCircle className="w-6 h-6" />, error: <XCircle className="w-6 h-6" />, warning: <AlertTriangle className="w-6 h-6" />, info: <Info className="w-6 h-6" /> };
    const colors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500', info: 'bg-sky-500' };
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => { onDismiss(); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification, onDismiss]);
    return (
        <AnimatePresence>
            {notification && (
                <motion.div initial={{ opacity: 0, y: -50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
                    <div className={`flex items-center gap-4 text-white p-4 rounded-xl shadow-2xl ${colors[notification.type]}`}>
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
          <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIP</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">Nama Pegawai</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Status</th>
          <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(rowsPerPage)].map((_, i) => (
          <tr key={i} className="h-[52px]"> {/* Sesuaikan tinggi row seperti data asli */}
            <td className="px-3 py-3 text-center">
              <div className="h-3 w-6 bg-gray-200 rounded mx-auto"></div>
            </td>
            <td className="px-3 py-3 text-center">
              <div className="h-3 w-20 bg-gray-200 rounded mx-auto"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </td>
            <td className="px-3 py-3 text-center">
              <div className="h-3 w-8 bg-gray-200 rounded mx-auto"></div>
            </td>
            <td className="px-3 py-3 text-center">
              <div className="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
            </td>
            <td className="px-3 py-3 text-center">
              <div className="h-6 w-20 bg-gray-200 rounded mx-auto"></div>
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

// MODAL DETAIL PEGAWAI YANG SUPER LENGKAP SEPERTI INDUK
const PegawaiDetailModal = ({ pegawai, onClose, loading }) => {
  if (!pegawai && !loading) return null;

  // Fungsi untuk format currency
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Lengkap Pegawai">
      {loading ? (
        <div className="p-8 text-center flex items-center justify-center flex-grow">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* FOTO DAN IDENTITAS UTAMA */}
          <div className="text-center bg-gray-50 p-6 rounded-xl">
            <img 
              src={`${PHOTO_BASE_URL}/PhotoPegawai/${pegawai.photopegawai}`}
              alt={`Foto ${pegawai.namapegawai}`} 
              className="w-32 h-40 object-cover rounded-lg mx-auto shadow-md border-4 border-white"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x160/e2e8f0/64748b?text=No+Image'; }}
            />
            <h3 className="text-2xl font-bold mt-4 text-gray-900">{pegawai.nama_lengkap}</h3>
            <p className="text-gray-500">NIP: {pegawai.nip}</p>
          </div>

          {/* IDENTITAS PEGAWAI */}
          <DetailSection title="📌 Identitas" icon={<User size={18} className="text-blue-500"/>}>
            <DetailRow label="ID Pegawai" value={pegawai.idpegawai} />
            <DetailRow label="Nama Lengkap" value={<span className="text-lg font-semibold">{pegawai.nama_lengkap}</span>} />
            <DetailRow label="NIP" value={pegawai.nip} />
            <DetailRow label="NUPTK" value={pegawai.nuptk} />
            <DetailRow label="NIK" value={pegawai.nik} />
            <DetailRow label="Tempat Lahir" value={pegawai.tmplahir} />
            <DetailRow label="Tanggal Lahir" value={new Date(pegawai.tgllahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
            <DetailRow label="Jenis Kelamin" value={pegawai.jk === 'L' ? 'Laki-laki' : 'Perempuan'} />
            <DetailRow label="Agama" value={pegawai.agama?.agama} />
            <DetailRow label="Status Aktif" value={pegawai.statusaktif} />
            <DetailRow label="Status Kepegawaian" value={pegawai.statuskepegawaian} />
            <DetailRow label="Kategori Kepegawaian" value={pegawai.kategorikepegawaian} />
            <DetailRow label="Nomor Rekening" value={pegawai.rekening} />
            <DetailRow label="NPWP" value={pegawai.npwp} />
            <DetailRow label="Golongan Darah" value={pegawai.golongan_darah} />
            <DetailRow label="No. Kartu Pegawai" value={pegawai.karpeg} />
            <DetailRow label="No. Askes/BPJS" value={pegawai.askes} />
            <DetailRow label="No. Taspen" value={pegawai.taspen} />
            <DetailRow label="No. Karis/Karsu" value={pegawai.karis} />
          </DetailSection>

          {/* ALAMAT LENGKAP */}
          <DetailSection title="🏠 Alamat" icon={<Home size={18} className="text-yellow-500"/>}>
            <DetailRow label="Jalan" value={pegawai.jalan} />
            <DetailRow label="RT/RW" value={`${pegawai.rt || '-'}/${pegawai.rw || '-'}`} />
            <DetailRow label="Dusun" value={pegawai.dusun} />
            <DetailRow label="Desa/Kelurahan" value={pegawai.desa} />
            <DetailRow label="Kecamatan" value={pegawai.kecamatan} />
            <DetailRow label="Kabupaten/Kota" value={pegawai.kabupaten} />
            <DetailRow label="Kode Pos" value={pegawai.kodepos} />
          </DetailSection>

          {/* KONTAK */}
          <DetailSection title="📞 Kontak" icon={<FileText size={18} className="text-green-500"/>}>
            <DetailRow label="Telepon Rumah" value={pegawai.tlprumah} />
            <DetailRow label="No. HP Pegawai" value={pegawai.hppegawai} />
            <DetailRow label="Email" value={pegawai.email} />
          </DetailSection>

          {/* KELUARGA */}
          <DetailSection title="👨‍👩‍👧‍👦 Keluarga" icon={<Users size={18} className="text-red-500"/>}>
            <DetailRow label="Nama Ibu Kandung" value={pegawai.namaibu} />
            <DetailRow label="Status Perkawinan" value={pegawai.statusperkawinan} />
            <DetailRow label="Nama Pasangan" value={pegawai.namapasangan} />
            <DetailRow label="Pekerjaan Pasangan" value={pegawai.pekerjaanpasangan} />
            <DetailRow label="NIP Pasangan" value={pegawai.nippasangan} />
            <DetailRow label="Jumlah Anak" value={pegawai.jml_anak} />
          </DetailSection>

          {/* ANAK / ANGGOTA KELUARGA */}
          <DetailSection title="👧 Daftar Anak / Anggota Keluarga" icon={<Users size={18} className="text-pink-500"/>}>
            {pegawai.keluargapegawai && pegawai.keluargapegawai.length > 0 ? (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left font-semibold">Nama</th>
                      <th className="p-2 border text-left font-semibold">Tempat Lahir</th>
                      <th className="p-2 border text-left font-semibold">Tanggal Lahir</th>
                      <th className="p-2 border text-left font-semibold">JK</th>
                      <th className="p-2 border text-left font-semibold">Pendidikan</th>
                      <th className="p-2 border text-left font-semibold">Nama Sekolah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawai.keluargapegawai.map((kel, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 border">{kel.nama_anggota_keluarga || '-'}</td>
                        <td className="p-2 border">{kel.tmp_lahir || '-'}</td>
                        <td className="p-2 border">{kel.tgl_lahir ? new Date(kel.tgl_lahir).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{kel.jk || '-'}</td>
                        <td className="p-2 border">{kel.pendidikan || '-'}</td>
                        <td className="p-2 border">{kel.nama_sekolah || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 p-2">Tidak ada data anak/keluarga.</p>
            )}
          </DetailSection>

          {/* PENDIDIKAN */}
          <DetailSection title="🎓 Riwayat Pendidikan" icon={<GraduationCap size={18} className="text-purple-500"/>}>
            {pegawai.pendidikanpegawai && pegawai.pendidikanpegawai.length > 0 ? (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left font-semibold">Pendidikan</th>
                      <th className="p-2 border text-left font-semibold">Nama Sekolah</th>
                      <th className="p-2 border text-left font-semibold">Jurusan</th>
                      <th className="p-2 border text-left font-semibold">Kota</th>
                      <th className="p-2 border text-left font-semibold">Nomor Ijazah</th>
                      <th className="p-2 border text-left font-semibold">Tanggal Ijazah</th>
                      <th className="p-2 border text-left font-semibold">Penandatangan Ijazah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawai.pendidikanpegawai.map((pd, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 border">{pd.pendidikan || '-'}</td>
                        <td className="p-2 border">{pd.nama_sekolah || '-'}</td>
                        <td className="p-2 border">{pd.jurusan || '-'}</td>
                        <td className="p-2 border">{pd.kota_sekolah || '-'}</td>
                        <td className="p-2 border">{pd.nomor_ijazah || '-'}</td>
                        <td className="p-2 border">{pd.tgl_ijazah ? new Date(pd.tgl_ijazah).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{pd.nama_ttd_ijazah || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 p-2">Tidak ada data pendidikan.</p>
            )}
          </DetailSection>

          {/* PANGKAT & JABATAN */}
          <DetailSection title="🏅 Riwayat Pangkat & Jabatan" icon={<Award size={18} className="text-orange-500"/>}>
            {pegawai.pangkatpegawai && pegawai.pangkatpegawai.length > 0 ? (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left font-semibold">Golongan</th>
                      <th className="p-2 border text-left font-semibold">Pangkat</th>
                      <th className="p-2 border text-left font-semibold">Jabatan</th>
                      <th className="p-2 border text-left font-semibold">Nomor SK</th>
                      <th className="p-2 border text-left font-semibold">TMT Pangkat</th>
                      <th className="p-2 border text-left font-semibold">Masa Kerja</th>
                      <th className="p-2 border text-left font-semibold">Angka Kredit</th>
                      <th className="p-2 border text-left font-semibold">Gaji Pokok</th>
                      <th className="p-2 border text-left font-semibold">Tanggal TTD</th>
                      <th className="p-2 border text-left font-semibold">Pejabat TTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawai.pangkatpegawai.map((pg, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 border">{pg.pangkat?.golongan || '-'}</td>
                        <td className="p-2 border">{pg.pangkat?.pangkat || '-'}</td>
                        <td className="p-2 border">{pg.pangkat?.jabatan || '-'}</td>
                        <td className="p-2 border">{pg.nomorsk || '-'}</td>
                        <td className="p-2 border">{pg.tmtpangkat ? new Date(pg.tmtpangkat).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{pg.masakerja_tahun ? `${pg.masakerja_tahun} tahun ${pg.masakerja_bulan || 0} bulan` : '-'}</td>
                        <td className="p-2 border">{pg.angka_kredit || '-'}</td>
                        <td className="p-2 border">{pg.gaji_pokok ? `Rp ${formatCurrency(pg.gaji_pokok)}` : '-'}</td>
                        <td className="p-2 border">{pg.tgl_ttd ? new Date(pg.tgl_ttd).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{pg.pejabat_ttd || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 p-2">Tidak ada data pangkat/jabatan.</p>
            )}
          </DetailSection>

          {/* GAJI BERKALA */}
          <DetailSection title="💰 Riwayat Gaji Berkala" icon={<Banknote size={18} className="text-teal-500"/>}>
            {pegawai.gajiberkala && pegawai.gajiberkala.length > 0 ? (
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left font-semibold">Nomor SK</th>
                      <th className="p-2 border text-left font-semibold">TMT Gaji Berkala</th>
                      <th className="p-2 border text-left font-semibold">Masa Kerja</th>
                      <th className="p-2 border text-left font-semibold">Gaji Lama</th>
                      <th className="p-2 border text-left font-semibold">Gaji Baru</th>
                      <th className="p-2 border text-left font-semibold">Tanggal SK</th>
                      <th className="p-2 border text-left font-semibold">Pejabat Penetap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawai.gajiberkala.map((gb, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2 border">{gb.nomorsk || '-'}</td>
                        <td className="p-2 border">{gb.tmtgajiberkala ? new Date(gb.tmtgajiberkala).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{gb.masakerja_tahun ? `${gb.masakerja_tahun} tahun ${gb.masakerja_bulan || 0} bulan` : '-'}</td>
                        <td className="p-2 border">{gb.gaji_pokok_lama ? `Rp ${formatCurrency(gb.gaji_pokok_lama)}` : '-'}</td>
                        <td className="p-2 border">{gb.gaji_pokok_baru ? `Rp ${formatCurrency(gb.gaji_pokok_baru)}` : '-'}</td>
                        <td className="p-2 border">{gb.tgl_ttd_sk ? new Date(gb.tgl_ttd_sk).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="p-2 border">{gb.pejabat_ttd || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 p-2">Tidak ada data gaji berkala.</p>
            )}
          </DetailSection>
        </div>
      )}
    </Modal>
  );
};

// =================================================================
// KOMPONEN UTAMA HALAMAN PEGAWAI
// =================================================================

const Pegawai = () => {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const [selectedPegawai, setSelectedPegawai] = useState(null);
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
      const response = await axios.get(`${API_URL}/pegawai`, {
        params: { page, search, rows_per_page: perPage }
      });
      setPegawaiList(response.data.data || []);
      setPagination({
        current_page: response.data.current_page, last_page: response.data.last_page,
        total: response.data.total, from: response.data.from, to: response.data.to,
      });
    } catch (err) {
      showNotif("error", "Gagal mengambil data pegawai dari server.");
      setPegawaiList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, debouncedTerm, rowsPerPage);
  }, [currentPage, debouncedTerm, rowsPerPage, fetchData]);

  const handleViewDetail = async (idpegawai) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${API_URL}/pegawai/${idpegawai}`);
      if (response.data.success) {
        setSelectedPegawai(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      showNotif('error', 'Gagal mengambil detail pegawai.');
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => { setIsModalOpen(false); setSelectedPegawai(null); };

  const getRowNumber = (index) => {
    if (!pagination) return index + 1;
    return pagination.from + index;
  };

  return (
    <>
      <Notification notification={notification} onDismiss={() => setNotification(null)} />
      
      <motion.div 
        className="bg-white shadow-xl rounded-2xl p-6" 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Pegawai</h1>
          <p className="text-gray-500 mt-1">Menampilkan data pegawai yang telah disinkronkan.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" placeholder="Cari nama atau NIP..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
        </div>

        {loading ? ( <LoadingTable rowsPerPage={rowsPerPage} /> ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                <tr>
                  <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIP</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">Nama Pegawai</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pegawaiList.map((p, index) => (
                  <tr key={p.idpegawai} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">{getRowNumber(index)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{p.nip}</td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      <button onClick={() => handleViewDetail(p.idpegawai)} className="text-blue-600 hover:text-blue-800 hover:underline text-left">{p.namapegawai}</button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{p.jk}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{p.statusaktif}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <button onClick={() => handleViewDetail(p.idpegawai)} className="bg-sky-100 text-sky-800 font-semibold p-2 rounded-lg hover:bg-sky-200 transition flex items-center gap-1 mx-auto">
                        <Info className="w-4 h-4" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && pegawaiList.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-6 text-gray-500">{debouncedTerm ? "Tidak ada data yang cocok." : "Tidak ada data."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.total > 0 && (
          <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
              <span>Baris per halaman:</span>
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 bg-transparent focus:outline-none border rounded-md">
                <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
            </div>
            <span>Menampilkan <strong>{pagination.from}-{pagination.to}</strong> dari <strong>{pagination.total}</strong></span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">Sebelumnya</button>
              <span>Hal {pagination.current_page} dari {pagination.last_page}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pagination.last_page} className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">Berikutnya</button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && <PegawaiDetailModal pegawai={selectedPegawai} onClose={closeModal} loading={loadingDetail} />}
      </AnimatePresence>
    </>
  );
};

export default Pegawai;
