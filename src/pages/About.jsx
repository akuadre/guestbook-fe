import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Users, ShieldCheck, BarChart3, Zap } from "lucide-react";

const appLogo = "/gambar/iconsekolah.png";
const profileImage = "/gambar/people/adre2.jpg";

// --- Animation Variants (Kalem & Smooth) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// --- Komponen Kartu Fitur (Clean Minimalist) ---
const FeatureCard = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

// --- Komponen Kartu Developer (Profesional) ---
const DeveloperCard = ({ name, website, role }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-center"
    >
      {/* Foto Profil */}
      <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
        <img
          src={profileImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Developer */}
      <div className="flex-1 text-center md:text-left">
        <p className="text-blue-600 font-semibold tracking-wider uppercase text-xs mb-1.5">
          {role}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>

        <a
          href={`https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors font-medium mb-3 text-sm"
        >
          {website}
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Latar Belakang / Story */}
        <div className="border-t border-gray-100 pt-3 mt-1">
          <p className="text-gray-600 text-sm leading-relaxed">
            Aplikasi ini dikembangkan dari tugas yang diberikan oleh{" "}
            <strong>Bapak Agus Suratna</strong>. Sebagai siswa jurusan{" "}
            <strong>RPL</strong> di <strong>SMK Negeri 1 Cimahi</strong>, saya
            merancang sistem ini hingga resmi diterapkan untuk mendukung
            kebutuhan sekolah.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Input & Kelola Tamu",
      description:
        "Fungsi utama untuk mencatat dan mengelola data kunjungan tamu sekolah.",
      color: "bg-blue-500",
    },
    {
      icon: ShieldCheck,
      title: "CRUD Data Master",
      description:
        "Pengelolaan data pendukung seperti Siswa, Pegawai/Guru, dan Jabatan.",
      color: "bg-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Statistik Kunjungan",
      description:
        "Visualisasi data tamu untuk memantau intensitas kunjungan secara mudah.",
      color: "bg-indigo-500",
    },
    {
      icon: Zap,
      title: "Simulasi Real-Case",
      description:
        "Berjalan mirip dengan sistem asli di sekolah, dioptimalkan untuk performa.",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 overflow-hidden font-sans">
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- 1. HEADER SECTION --- */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <img
            src={appLogo}
            alt="Logo SMKN 1 Cimahi"
            className="h-24 w-24 object-contain bg-white rounded-2xl p-2 shadow-sm border border-gray-200 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            School Guestbook
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            Sistem Informasi Manajemen Buku Tamu Sekolah.
          </p>
        </motion.div>

        {/* --- 2. ABOUT DESCRIPTION SECTION (Intinya Aja) --- */}
        <motion.div variants={itemVariants} className="mb-20">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-200">
            <div className="max-w-3xl mx-auto text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tentang Aplikasi
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-md">
                <p>
                  Aplikasi ini memiliki fungsi utama untuk{" "}
                  <strong>menginput dan mengelola data buku tamu</strong>.
                  Selain itu, sistem ini juga dilengkapi dengan fitur
                  pengelolaan data (CRUD) untuk entitas pendukung seperti Siswa,
                  Pegawai/Guru, dan Jabatan.
                </p>
                <p>
                  Secara garis besar, alur dan fitur aplikasi ini dirancang
                  mirip persis dengan sistem buku tamu yang diterapkan di
                  sekolah nyata. Perbedaannya, aplikasi ini menggunakan{" "}
                  <em>fake data</em> (data dummy) untuk keperluan demonstrasi.
                </p>
                <p>
                  Beberapa data riwayat dan kebutuhan administratif kompleks
                  yang biasa digunakan di sekolah asli tidak sepenuhnya
                  diterapkan di sini, guna menjaga aplikasi tetap ringan dan
                  fokus pada fungsi utamanya.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- 3. KEY FEATURES SECTION --- */}
        <div className="mb-20">
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Fitur Utama</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* --- 4. DEVELOPER SECTION --- */}
        <div>
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Developed By</h2>
          </motion.div>

          <div className="max-w-2xl">
            <DeveloperCard
              name="Adrenalin Muhammad D"
              website="adre.my.id"
              role="Fullstack Web Developer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
