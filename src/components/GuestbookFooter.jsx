// src/components/GuestbookFooter.jsx
import React from "react";

const GuestbookFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center py-6">
      <p className="text-slate-500 text-sm">
        &copy; {currentYear} Buku Tamu Digital. Dibuat oleh Siswa RPL SMKN 1
        Cimahi.
      </p>
    </footer>
  );
};

export default GuestbookFooter;
