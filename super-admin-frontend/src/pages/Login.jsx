import { useState } from "react";
import { User, Lock, Leaf } from "lucide-react";
import api from "../api/axios";

export default function Login({ onLoginSuccess }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState(""); // otp
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [popup, setPopup] = useState({
  show: false,
  message: "",
  type: "success", // success | error
});
const showPopup = (message, type = "success") => {
  setPopup({ show: true, message, type });
};

const closePopup = () => {
  setPopup({ show: false, message: "", type: "success" });
};

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (mobile.length !== 10) {
    showPopup("Please enter a valid 10-digit mobile number", "error");
    setLoading(false);
    return;
  }

  try {
    if (step === 1) {
      await api.post("/auth/send-otp", { mobile });
      showPopup("OTP sent successfully");
      setStep(2);
    } else {
      await api.post("/auth/verify-otp", {
        mobile,
        otp: password,
      });

      await api.get("/company/dashboard");

      showPopup("Login successful");
      setTimeout(onLoginSuccess, 800);
    }
  } catch (err) {
    showPopup(
      err.response?.data?.message || "Authentication failed",
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  const resendOtp = async () => {
  setLoading(true);
  try {
    await api.post("/auth/send-otp", { mobile });
    showPopup("OTP resent successfully");
  } catch {
    showPopup("Failed to resend OTP", "error");
  } finally {
    setLoading(false);
  }
};


  const editMobile = () => {
    setStep(1);
    setPassword(""); // clear OTP
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="w-full max-w-4xl mx-4 rounded-lg overflow-hidden shadow-xl"
        style={{ height: "500px" }}
      >
        <div className="flex h-full">
          <div
            className="w-1/2 flex items-center justify-center text-white hidden md:flex"
            style={{ backgroundColor: "#6c7a86" }}
          >
            <div className="text-center">
              <h1 className="text-5xl font-bold leading-tight">
                Hello Super Admin,
                <br />
                WELCOME
              </h1>
            </div>
          </div>

          <div
            className="w-full md:w-1/2 flex flex-col items-center justify-center p-8"
            style={{ backgroundColor: "#d9e7e2" }}
          >
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#20b2aa" }}
                >
                  <Leaf size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold" style={{ color: "#1a4d5c" }}>
                Smart Waste
              </h2>
              <p className="text-lg font-bold" style={{ color: "#1a4d5c" }}>
                Management
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-3 top-3"
                  style={{ color: "#999" }}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  placeholder="Mobile Number"
                  value={mobile}
                  disabled={step === 2}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setMobile(value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#d0d0d0",
                    color: "#333",
                  }}
                />
              </div>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-3"
                  style={{ color: "#999" }}
                />
                <input
                  type="password"
                  placeholder={step === 1 ? "OTP will be sent" : "Enter OTP"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={step === 1}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#d0d0d0",
                    color: "#333",
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              {step === 2 && (
                <div className="flex justify-between text-sm mt-2">
                  <button
                    type="button"
                    onClick={editMobile}
                    className="underline"
                    style={{ color: "#5555ff" }}
                  >
                    Edit mobile number
                  </button>

                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={loading}
                    className="underline"
                    style={{ color: "#5555ff" }}
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-40 mx-auto block py-2 px-6 text-white font-semibold rounded-lg transition duration-200 mt-6"
                style={{
                  backgroundColor: loading ? "#999" : "#20b2aa",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? "Processing..."
                  : step === 1
                  ? "Send OTP"
                  : "Verify OTP"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm font-medium underline"
                style={{ color: "#5555ff" }}
              >
                Forgot password? Receive an OTP
              </button>
            </div>
          </div>
        </div>
      </div>
      {popup.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div
      className="bg-white rounded-lg px-6 py-4 shadow-lg text-center"
      style={{ minWidth: "260px" }}
    >
      <p
        className="font-medium mb-4"
        style={{
          color: popup.type === "error" ? "#d32f2f" : "#2e7d32",
        }}
      >
        {popup.message}
      </p>
      <button
        onClick={closePopup}
        className="px-4 py-1 rounded text-white"
        style={{
          backgroundColor:
            popup.type === "error" ? "#d32f2f" : "#20b2aa",
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
}
