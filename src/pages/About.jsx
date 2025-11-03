import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Palette, Zap, Heart } from 'lucide-react';

const appLogo = '/gambar/iconsekolah.png';
const profileImage = '/gambar/people/adre2.jpg';

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
      ease: "easeOut"
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
      ease: "backOut"
    }
  }
};
// --- End Animation Variants ---

// Komponen Card yang lebih modern
const DeveloperCard = ({ name, website, role, techStack }) => {
    return (
        <motion.div 
            className="relative bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-xl group overflow-hidden border border-blue-100 glow-card hover:shadow-2xl transition-all duration-300"
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex items-start space-x-4">
                    <div className="relative">
                        <img 
                            src={profileImage} 
                            alt={name} 
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-lg ring-2 ring-blue-200"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-full">
                            <Zap className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {name}
                        </h3>
                        <p className="text-gray-600 font-medium mt-1">{role}</p>
                        
                        <a 
                            href={`https://${website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition-colors inline-flex items-center group/link mt-2 font-semibold"
                        >
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                {website}
                            </span>
                            <ExternalLink className="h-4 w-4 ml-1.5 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                        </a>

                        {/* Tech Stack */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {techStack.map((tech, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
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
            <div className={`p-3 rounded-lg ${color} w-12 h-12 flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const About = () => {
    const features = [
        {
            icon: Code,
            title: "Modern Technology",
            description: "Dibangun dengan React & Laravel terbaru untuk performa optimal dan pengalaman pengguna yang smooth.",
            color: "bg-gradient-to-r from-blue-500 to-blue-600"
        },
        {
            icon: Palette,
            title: "Beautiful Design",
            description: "Interface yang elegan dan user-friendly dengan animasi yang halus dan responsive design.",
            color: "bg-gradient-to-r from-purple-500 to-purple-600"
        },
        {
            icon: Zap,
            title: "High Performance",
            description: "Optimized untuk kecepatan loading dan efisiensi resource, memberikan pengalaman terbaik.",
            color: "bg-gradient-to-r from-cyan-500 to-cyan-600"
        }
    ];

    const techStack = ["React", "Laravel", "TailwindCSS", "Node.js", "MySQL", "REST API"];

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
                            School <span className="gradient-text">Guestbook</span>
                        </motion.h1>
                        
                        <motion.p 
                            variants={itemVariants}
                            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                        >
                            Sistem manajemen buku tamu digital modern yang mengubah cara sekolah 
                            mencatat dan mengelola kunjungan tamu dengan teknologi terkini.
                        </motion.p>
                    </motion.div>

                    {/* Developer Section */}
                    <motion.div variants={itemVariants} className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                            Developed with <Heart className="inline h-8 w-8 text-sky-500 mx-1" /> by
                        </h2>
                        <div className="max-w-2xl mx-auto">
                            <DeveloperCard 
                                name="Adrenalin M. Dewangga"
                                website="adre.vercel.app"
                                role="Full Stack Developer"
                                techStack={techStack}
                            />
                        </div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div variants={itemVariants} className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                            Why Choose Our System?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
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
                                Aplikasi Website Buku Tamu Sekolah ini dirancang untuk mempermudah pencatatan 
                                serta pengelolaan data kunjungan tamu secara digital di lingkungan sekolah. 
                                Sistem ini mencatat data tamu, baik orang tua siswa maupun tamu umum, serta 
                                menghubungkan mereka dengan pegawai atau guru yang akan ditemui.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed mt-4">
                                Selain itu, aplikasi ini menyediakan laporan dan statistik kunjungan untuk 
                                kebutuhan administrasi serta meningkatkan keamanan dengan validasi data tamu, 
                                memastikan proses kunjungan lebih terstruktur dan efisien.
                            </p>
                        </div>
                    </motion.div>

                    {/* Footer Note */}
                    <motion.div 
                        variants={itemVariants}
                        className="text-center mt-12"
                    >
                        <p className="text-gray-500 text-sm">
                            Built with modern web technologies • {new Date().getFullYear()}
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default About;