import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// Taruh gambar ikon di folder `public/gambar/`
const appLogo = '/gambar/icon2.png';

// --- Animation Variants for Framer Motion ---
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};
// --- End Animation Variants ---

// Komponen Card yang sudah di-upgrade
const InfoCard = ({ name, website, color, imageUrl }) => {
    // Efek glowing akan dihandle oleh CSS di komponen utama
    return (
        <div className="relative bg-white p-5 rounded-xl shadow-md group overflow-hidden border border-gray-100 glow-card">
            <div className="flex items-center space-x-4">
                <img src={imageUrl} alt={name} className="h-14 w-14 rounded-full object-cover border-2 border-white ring-2 ring-gray-200" />
                <div className="text-left">
                    <h3 className={`text-xl font-semibold ${color || 'text-gray-800'}`}>{name}</h3>
                    <a 
                        href={`https://${website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors inline-flex items-center group/link mt-1"
                    >
                        <span>{website}</span>
                        <ExternalLink className="h-4 w-4 ml-1.5 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                </div>
            </div>
        </div>
    );
};

const About = () => {
    return (
        <>
            {/* CSS untuk efek glowing, ditaruh di sini agar terisolasi */}
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
                    border-radius: 0.75rem; /* Sesuai dengan rounded-xl */
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    pointer-events: none; /* Penting agar tidak menghalangi klik */
                }
                .glow-card:hover::before {
                    opacity: 1;
                }
                `}
            </style>
            <motion.div 
                className="bg-gray-50 shadow-lg rounded-lg p-6 md:p-8"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onMouseMove={(e) => {
                    // Update posisi mouse untuk efek glow pada semua kartu
                    const cards = document.querySelectorAll('.glow-card');
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        card.style.setProperty('--x', `${x}px`);
                        card.style.setProperty('--y', `${y}px`);
                    });
                }}
            >
                <motion.div 
                    className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="text-center">
                        <motion.div variants={itemVariants} className="flex justify-center mb-6">
                            <img 
                                src={appLogo} 
                                alt="App Logo" 
                                className="rounded-full h-40 w-40 object-cover shadow-lg border-4 border-white ring-4 ring-blue-500"
                            />
                        </motion.div>
                        
                        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 tracking-tight">
                            Tentang Aplikasi School Guestbook
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                            Sebuah sistem modern untuk manajemen data sekolah yang efisien dan terintegrasi.
                        </motion.p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Pembimbing</h2>
                            <InfoCard 
                                name="Agus Suratna Permadi, S.Pd."
                                website="agussuratna.net"
                                color="text-blue-700"
                                imageUrl="https://placehold.co/100x100/EBF4FF/3B82F6?text=AS"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Dikembangkan oleh</h2>
                            <div className="space-y-4">
                               <InfoCard 
                                    name="Adrenalin M. Dewangga"
                                    website="adre.my.id"
                                    color="text-sky-600"
                                    imageUrl="https://placehold.co/100x100/E0F2FE/0891B2?text=AD"
                                />
                                <InfoCard 
                                    name="Evliya Satari Nurarifah"
                                    website="evliya.my.id"
                                    color="text-pink-600"
                                    imageUrl="https://placehold.co/100x100/FCE7F3/DB2777?text=ES"
                                />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="mt-14 text-center text-gray-500 text-md">
                        <p className="mt-1">Aplikasi Website Buku Tamu Sekolah ini dirancang untuk mempermudah pencatatan serta pengelolaan data kunjungan tamu secara digital di lingkungan sekolah. Sistem ini mencatat data tamu, baik orang tua siswa maupun tamu umum, serta menghubungkan mereka dengan pegawai atau guru yang akan ditemui. Selain itu, aplikasi ini menyediakan laporan dan statistik kunjungan untuk kebutuhan administrasi serta meningkatkan keamanan dengan validasi data tamu, memastikan proses kunjungan lebih terstruktur dan efisien.</p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default About;

