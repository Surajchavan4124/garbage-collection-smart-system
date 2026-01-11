import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); 
  // checking | authorized | unauthorized

  useEffect(() => {
    let alive = true;

    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        if (alive) setStatus("authorized");
      } catch {
        if (alive) setStatus("unauthorized");
      }
    };

    checkAuth();
    return () => (alive = false);
  }, []);

  // 🚫 DO NOT redirect while checking
  if (status === "checking") return null;

  if (status === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  return children;
}
