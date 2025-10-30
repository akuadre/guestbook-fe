// src/components/GuestbookHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react"; // Menggunakan ikon dari Lucide
import Logo from "/gambar/icon2.png"; // Pastikan path logo benar

const GuestbookHeader = () => {
  return (
    <header className="fixed top-0 w-full z-50 transition duration-300 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img src={Logo} alt="Logo" className="w-9 h-9" />
          <h1 className="text-2xl font-bold text-slate-800 group-hover:text-sky-600 transition duration-300">
            GuestBook
          </h1>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition transform hover:scale-105"
        >
          <LogIn size={16} />
          <span>Login Admin</span>
        </Link>
      </div>
    </header>
  );
};

export default GuestbookHeader;
