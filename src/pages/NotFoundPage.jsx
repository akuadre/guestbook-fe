import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* KEYFRAMES */}
      <style>{`
        @keyframes pulse-glow { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.03); } 
        }

        @keyframes float { 
          0% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-12px) rotate(5deg); } 
          100% { transform: translateY(0px) rotate(0deg); } 
        }

        @keyframes drift { 
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 
          30% { transform: translateY(-5px) translateX(10px) rotate(10deg); } 
          70% { transform: translateY(5px) translateX(-10px) rotate(-5deg); } 
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); } 
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .pulse-glow { animation: pulse-glow 15s infinite ease-in-out; }
        .float-animation { animation: float 6s infinite ease-in-out; }
        .drift { animation: drift 8s infinite ease-in-out; }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* MAIN */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white px-5 sm:px-6">
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] rounded-full pulse-glow"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.28) 0%, transparent 45%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute top-20 left-16 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl opacity-20 float-animation" />
          <div
            className="absolute top-40 right-24 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-25 float-animation"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-28 left-32 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rotate-45 opacity-15 drift"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* CONTENT (CLASSNAME DIBIKIN 1 BARIS BIAR TAILWIND V4 GAK NGEBUG) */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8 sm:p-14 text-center"
          >
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 tracking-wide mb-6"
            >
              <Compass size={16} />
              Keluar Dari Radar
            </motion.div>

            {/* 404 MASSIVE TEXT */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[8rem] md:text-[12rem] leading-none py-2 font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 drop-shadow-sm"
            >
              404
            </motion.h1>

            {/* TITLE */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mt-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white"
            >
              Halaman Tidak Ditemukan
            </motion.h2>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-4 text-base sm:text-lg text-blue-100/70 leading-relaxed max-w-md mx-auto font-medium"
            >
              Maaf, sepertinya Anda mengakses tautan yang salah atau halaman ini
              telah dipindahkan.
            </motion.p>

            {/* BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10"
            >
              <button
                onClick={() => navigate("/")}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 hover:from-blue-400 hover:to-blue-500 border border-blue-400/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home
                    size={20}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />
                  Kembali ke Beranda
                </span>
                <div className="absolute inset-0 shimmer opacity-50" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
