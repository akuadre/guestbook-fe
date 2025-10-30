// src/components/Footer.jsx

import React from 'react';
import { Heart } from 'lucide-react'; // Opsional, jika ingin pakai ikon

const Footer = () => {
  return (
    // [!] Hapus background gelap, ganti dengan border atas yang sangat subtle
    // [!] Layout diubah menjadi flexbox untuk tampilan profesional
    <footer className="w-full p-6 mt-auto text-sm border-t border-gray-200/80 bg-slate-200/50">
      <div className="flex flex-col sm:flex-row items-center justify-between text-gray-500">
        
        {/* Bagian Kiri: Copyright */}
        <p>
          &copy; {new Date().getFullYear()} School Guestbook. All rights reserved.
        </p>

        {/* Bagian Kanan: Info & Links */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="hidden md:inline">
                Dibuat dengan ❤️ di SMKN 1 Cimahi
            </span>
            {/* [!] Link placeholder untuk kesan premium */}
            <div className="flex items-center gap-4 text-gray-600 font-medium">
                <a href="#" className="hover:text-sky-600 transition-colors">Bantuan</a>
                <a href="#" className="hover:text-sky-600 transition-colors">Lisensi</a>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;