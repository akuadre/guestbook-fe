import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

// Untuk route yang cuma bisa diakses kalau user **belum login**
const GuestRoute = () => {
  const token = localStorage.getItem("adminToken");
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

// Untuk route yang cuma bisa diakses kalau user **sudah login**
const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Set header Authorization untuk semua request
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return <Outlet />;
};

export { GuestRoute, ProtectedRoute };