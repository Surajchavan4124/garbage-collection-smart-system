import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import api from "./api/axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubscriptionPlanManagement from "./pages/SubscriptionPlanManagement";
import PaymentMonitoring from "./pages/PaymentMonitoring";
import SupportQueries from "./pages/SupportQueries";

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (authLoading) return <div>Loading...</div>;

  return (
    <>   
     <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/subscriptions"
          element={
            isAuthenticated ? (
              <SubscriptionPlanManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/payments"
          element={
            isAuthenticated ? (
              <PaymentMonitoring />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/support"
          element={
            isAuthenticated ? <SupportQueries /> : <Navigate to="/login" />
          }
        />
        

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
