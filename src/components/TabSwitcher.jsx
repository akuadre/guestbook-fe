// src/components/TabSwitcher.jsx
import React from "react";
import { motion } from "framer-motion";

const tabs = [
  { id: "parent", label: "Orang Tua" },
  { id: "general", label: "Tamu Umum" },
];

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="relative w-fit mx-auto bg-slate-200 p-1 rounded-full flex items-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative z-10 font-semibold px-6 py-2 rounded-full transition-colors duration-300
            ${
              activeTab === tab.id
                ? "text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-indicator" // Kunci animasi pergeseran
              className="absolute inset-0 bg-white shadow-md rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
