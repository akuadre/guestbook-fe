import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-sky-500',
};

const Notification = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // Otomatis hilang setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`flex items-center gap-4 text-white p-4 rounded-xl shadow-2xl ${colors[notification.type]}`}>
            {icons[notification.type]}
            <span className="font-medium">{notification.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;