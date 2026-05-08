import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import axios from "axios";

// Icons from lucide-react
import { Menu, X, ArrowUp, Calendar, ChevronRight } from "lucide-react";

// Import images (make sure paths are correct in your React project)
import logoSekolah from "/gambar/iconsekolah.png";

const LandingPage = () => {
  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newsError, setNewsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Detect success status from redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("status") === "success") {
      setShowSuccessModal(true);
      // Clean up the URL so it doesn't trigger again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch news posts from API - CARA LAMA YANG SIMPLE
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://www.smkn1-cmi.sch.id/wp-json/wp/v2/posts?per_page=10&_embed&orderby=date&order=desc"
        );

        // Filter posts with featured images
        const postsWithImages = response.data.filter(
          (post) =>
            post._embedded &&
            post._embedded["wp:featuredmedia"] &&
            post._embedded["wp:featuredmedia"][0]?.source_url
        );

        setPosts(postsWithImages);
      } catch (err) {
        setNewsError("Gagal mengambil data berita.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
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
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        message="Data berhasil disimpan! Terima kasih telah berkunjung."
        />
      
      {/* Keyframe Animations */}
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
        
        /* Custom Splide Styles */
        .splide__arrow {
          background: rgba(255, 255, 255, 0.2) !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .splide__arrow:hover {
          background: rgba(255, 255, 255, 0.6) !important;
        }
        .splide__arrow svg {
          fill: white !important;
        }
      `}</style>

      {/* NAVBAR */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? "bg-slate-800 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => scrollToSection("beranda")}
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
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="cursor-pointer py-2 hover:text-sky-300 transition font-medium"
              >
                {item.name}
              </button>
            ))}
            <RouterLink
              to="/login"
              className="mt-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full shadow-lg transition"
            >
              Login Admin
            </RouterLink>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section
          id="beranda"
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white pt-24 pb-16"
        >
          {/* Background Effects */}
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

          <div className="relative z-10 w-full container mx-auto px-6 flex flex-col items-center">
            {/* News Slider */}
            <div className="w-full max-w-4xl mb-12">
              {isLoading && (
                <div className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-2 shadow-2xl">
                  <Splide
                    options={{
                      type: "loop",
                      perPage: 1,
                      autoplay: false,
                      arrows: true,
                      pagination: true,
                    }}
                  >
                    {/* Buat 3 skeleton slides */}
                    {[1, 2, 3].map((item) => (
                      <SplideSlide key={item}>
                        <div className="block h-[400px] rounded-lg relative overflow-hidden">
                          {/* Skeleton Image Area */}
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shimmer"></div>

                          {/* Skeleton Content Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                            {/* Skeleton Title Lines */}
                            <div className="space-y-3 mb-4">
                              <div className="h-7 bg-gray-500 rounded w-4/5 shimmer"></div>
                              <div className="h-5 bg-gray-500 rounded w-3/4 shimmer"></div>
                            </div>

                            {/* Skeleton Date */}
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-gray-500 rounded shimmer"></div>
                              <div className="h-4 bg-gray-500 rounded w-40 shimmer"></div>
                            </div>
                          </div>

                          {/* Skeleton Navigation Dots */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {[1, 2, 3].map((dot) => (
                              <div
                                key={dot}
                                className={`w-3 h-3 rounded-full ${
                                  dot === 1 ? "bg-gray-400" : "bg-gray-600"
                                } shimmer`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </SplideSlide>
                    ))}
                  </Splide>
                </div>
              )}

              {newsError && (
                <div className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-2 shadow-2xl">
                  <Splide
                    options={{
                      type: "loop",
                      perPage: 1,
                      autoplay: false,
                      arrows: true,
                      pagination: true,
                    }}
                  >
                    <SplideSlide>
                      <div className="block h-[400px] rounded-lg relative overflow-hidden">
                        {/* Background untuk error card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
                        
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col items-center justify-center p-8 text-center">
                          {/* Warning Icon */}
                          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/30">
                            <svg 
                              className="w-10 h-10 text-yellow-300" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </div>
                          
                          {/* Error Message */}
                          <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                            Berita Tidak Tersedia
                          </h3>
                          <p className="text-yellow-200 text-lg mb-2 leading-relaxed">
                            {newsError}
                          </p>
                          <p className="text-yellow-400/80 text-sm">
                            Fitur buku tamu tetap dapat digunakan dengan normal
                          </p>
                          
                          {/* Refresh Button */}
                          <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Coba Refresh
                          </button>
                        </div>

                        {/* Fake date untuk konsistensi */}
                        <div className="absolute bottom-6 left-6 flex items-center text-sm text-yellow-300/70">
                          <Calendar size={14} className="mr-2" />
                          <span>{new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}</span>
                        </div>
                      </div>
                    </SplideSlide>
                  </Splide>
                </div>
              )}

              {!isLoading && !newsError && posts.length > 0 && (
                <div className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-2 shadow-2xl">
                  <Splide
                    options={{
                      type: "loop",
                      perPage: 1,
                      autoplay: true,
                      interval: 4000,
                      arrows: true,
                      pagination: true,
                      pauseOnHover: true,
                    }}
                  >
                    {posts.map((post) => (
                      <SplideSlide key={post.id}>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-[400px] rounded-lg relative overflow-hidden group"
                        >
                          <img
                            src={
                              post._embedded["wp:featuredmedia"][0].source_url
                            }
                            alt={post.title.rendered}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 transition-all group-hover:from-black/90">
                            <h3
                              className="text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition"
                              dangerouslySetInnerHTML={{
                                __html: post.title.rendered,
                              }}
                            />
                            <div className="flex items-center text-sm text-gray-300">
                              <Calendar size={14} className="mr-2" />
                              <span>
                                {new Date(post.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </a>
                      </SplideSlide>
                    ))}
                  </Splide>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
              {/* Left Side - Welcome Content */}
              <div className="w-full lg:w-1/2 flex flex-col items-center text-center space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <img
                    src={logoSekolah}
                    alt="Guestbook Icon"
                    className="relative w-36 h-36 drop-shadow-2xl transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                    Selamat Datang di SMKN 1 Cimahi
                  </h2>
                  <p className="text-xl text-blue-200">
                    Silakan mengisi buku tamu digital kami
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                  <RouterLink
                    to="/input"
                    onClick={() => localStorage.setItem('guestbookActiveTab', 'parent')}
                    className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Orang Tua
                      <ChevronRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </span>
                    <div className="absolute inset-0 shimmer"></div>
                  </RouterLink>

                  <RouterLink
                    to="/input"
                    onClick={() => localStorage.setItem('guestbookActiveTab', 'general')}
                    className="group relative w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Tamu Umum
                      <ChevronRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </span>
                    <div className="absolute inset-0 shimmer"></div>
                  </RouterLink>
                </div>
              </div>

              {/* Right Side - Video dengan Playlist */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                      Video Profil Sekolah
                    </h3>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                      <iframe
                        src="https://www.youtube.com/embed/videoseries?list=PLXr0YeRsh2I7mGSBrj6XfGxJW-glUo-CZ&autoplay=1&mute=0&rel=0&modestbranding=1&controls=1&loop=1"
                        title="Playlist Profil Sekolah SMKN 1 Cimahi"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-blue-200 text-center mt-4">
                      Playlist lengkap profil sekolah. Video akan berlanjut ke
                      materi sekolah setelah intro jurusan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-800 text-white text-center py-8 border-t border-slate-700">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Buku Tamu Digital. Development by
          Software Engineer SMKN 1 Cimahi.
        </p>
      </footer>

      {/* SCROLL TO TOP BUTTON */}
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

export default LandingPage;