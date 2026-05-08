// src/pages/GuestbookPage.jsx
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";

// Icons from lucide-react
import { Menu, X, ArrowUp } from "lucide-react";

// Import images (pastikan path sesuai)
import logoSekolah from "/gambar/iconsekolah.png";

const GuestbookPage = () => {
  const navigate = useNavigate();

  // States untuk navbar dan scroll effect
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll effects (sama seperti LandingPage)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const navItems = [{ name: "Beranda", id: "beranda" }];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Keyframe Animations (sama seperti LandingPage) */}
      <style>{`
        @keyframes pulse-glow { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.02); } 
        }
        @keyframes float { 
          0% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-10px) rotate(5deg); } 
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
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* NAVBAR (sama seperti LandingPage) */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? "bg-slate-800 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src={logoSekolah}
              alt="Logo"
              className="w-8 h-8 drop-shadow-xl transition-transform group-hover:scale-110"
            />
            <h1 className="text-2xl font-semibold text-white drop-shadow-xl group-hover:text-blue-200 transition">
              GuestBook
            </h1>
          </button>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white transition-transform hover:scale-110"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 text-white flex flex-col items-center gap-4 py-4 border-t border-slate-700">
            <RouterLink
              to="/"
              className="mt-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full shadow-lg transition"
            >
              Beranda
            </RouterLink>
          </div>
        )}
      </header>

      {/* MAIN CONTENT dengan background sama seperti LandingPage */}
      <main>
        <section
          id="beranda"
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white pt-24"
        >
          {/* Background Effects (sama seperti LandingPage) */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] rounded-full pulse-glow"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 40%)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Floating Shapes */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl opacity-20 float-animation" />
            <div
              className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-25 float-animation"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rotate-45 opacity-15 drift"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Form Card di tengah */}
          <div className="relative z-10 w-full container mx-auto mt-6 mb-12 px-6 flex items-center justify-center">
            <FormCard />
          </div>
        </section>
      </main>

      {/* FOOTER (sama seperti LandingPage) */}
      <footer className="bg-slate-800 text-white text-center py-8 border-t border-slate-700">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Buku Tamu Digital. Development by
          Software Engineer SMKN 1 Cimahi.
        </p>
      </footer>

      {/* SCROLL TO TOP BUTTON (sama seperti LandingPage) */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-sky-500 text-white p-4 rounded-full shadow-2xl hover:bg-sky-600 transition-all duration-300 z-50 hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default GuestbookPage;