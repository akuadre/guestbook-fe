import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code, Palette, Zap, Heart } from "lucide-react";

const appLogo = "/gambar/iconsekolah.png";
const profileImage = "/gambar/people/adre2.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "backOut",
    },
  },
};
// --- End Animation Variants ---

const DeveloperCard = ({ name, website, role, techStack }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all duration-300"
      variants={cardVariants}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={profileImage}
            alt={name}
            className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-lg ring-2 ring-blue-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-300 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <div className="text-left flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-gray-500 text-sm mb-3">{role}</p>

          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors inline-flex items-center text-sm font-medium"
          >
            {website}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>

          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white text-gray-700 rounded text-xs font-medium border border-gray-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Komponen Fitur
const FeatureCard = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`p-3 rounded-lg ${color} w-12 h-12 flex items-center justify-center mb-4`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const About = () => {
  const techStack = ["React", "Laravel", "TailwindCSS", "MySQL", "REST API"];

  return (
    <>
      {/* CSS untuk efek glowing */}
      <style>
        {`
                .glow-card {
                    position: relative;
                }
                .glow-card::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at var(--x) var(--y), rgba(59, 130, 246, 0.15), transparent 40%);
                    border-radius: 1rem;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    pointer-events: none;
                }
                .glow-card:hover::before {
                    opacity: 1;
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                `}
      </style>

      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onMouseMove={(e) => {
          const cards = document.querySelectorAll(".glow-card");
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
          });
        }}
      >
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="rounded-2xl h-32 w-32 object-cover shadow-2xl border-4 border-white ring-4 ring-blue-500/20"
                />
              </motion.div>
            </div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              School Guestbook
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Sistem manajemen buku tamu digital modern yang mengubah cara
              sekolah mencatat dan mengelola kunjungan tamu dengan teknologi
              terkini.
            </motion.p>
          </motion.div>

          {/* Developer Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Developed by
            </h2>
            <div className="max-w-2xl mx-auto">
              <DeveloperCard
                name="Adrenalin Muhammad D"
                website="adre.vercel.app"
                role="Junior Web Developer"
                techStack={techStack}
              />
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Tentang Aplikasi
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Aplikasi Website Buku Tamu Sekolah ini dirancang untuk
                mempermudah pencatatan serta pengelolaan data kunjungan tamu
                secara digital di lingkungan sekolah. Sistem ini mencatat data
                tamu, baik orang tua siswa maupun tamu umum, serta menghubungkan
                mereka dengan pegawai atau guru yang akan ditemui.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Selain itu, aplikasi ini menyediakan laporan dan statistik
                kunjungan untuk kebutuhan administrasi serta meningkatkan
                keamanan dengan validasi data tamu, memastikan proses kunjungan
                lebih terstruktur dan efisien.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default About;
