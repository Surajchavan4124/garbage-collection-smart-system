import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Key, X } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToShow, setOtpToShow] = useState("");

  // SEND / RESEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { mobile });

      if (res.data.otp) {
        setOtpToShow(res.data.otp);
        setShowOtpModal(true);
      } else {
        toast.success("OTP sent successfully");
      }
      setOtpSent(true);
      setOtp("");
      setTimer(30);

      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { mobile, otp });

      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const editMobile = () => {
    setOtpSent(false);
    setOtp("");
    setTimer(0);
    toast.info("You can edit mobile number");
  };

  return (
    <div className="flex w-full h-screen bg-[#f3f4f6] items-center justify-center px-4 md:px-8">
      <div className="flex w-full max-w-4xl h-[550px] rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden md:flex flex-1 bg-[#6a8795] items-center justify-center p-12">
          <h1 className="text-white text-5xl font-extrabold text-center leading-tight tracking-wide">
            HELLO ADMIN,
            <br />
            WELCOME
          </h1>
        </div>

        <div className="w-full md:flex-1 bg-[#d0e8e5] flex flex-col items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-6 mb-24">
              <div className="w-11 h-11 bg-[#1f9e9a] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h1 className="text-2xl font-black text-[#333333] uppercase">
                Smart Waste
                <br />
                Admin
              </h1>
            </div>

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="flex flex-col gap-4"
            >
              {/* Mobile */}
              <div className="group relative flex items-center">
                <div className="absolute left-4 z-10 pointer-events-none">
                  <User size={22} className="text-gray-400" />
                </div>

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={otpSent}
                  style={{ paddingLeft: "60px" }}
                  className="w-full h-[55px] pr-4 text-lg bg-white border rounded-2xl"
                />
              </div>

              {/* OTP */}
              {otpSent && (
                <div className="group relative flex items-center">
                  <div className="absolute left-4 z-10 pointer-events-none">
                    <Key size={22} className="text-gray-400" />
                  </div>

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ paddingLeft: "60px" }}
                    className="w-full h-[55px] pr-4 text-lg bg-white border border-gray-300 rounded-2xl outline-none tracking-widest"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1f9e9a] text-white font-extrabold h-[55px] rounded-2xl mt-4 text-xl"
              >
                {otpSent
                  ? loading
                    ? "Verifying..."
                    : "Verify OTP"
                  : loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>

            {otpSent && (
              <div className="flex justify-between mt-6 text-sm font-semibold">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={timer > 0}
                  className="text-[#1f9e9a]"
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={editMobile}
                  className="text-gray-600"
                >
                  Edit Mobile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#1f9e9a] p-6 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold">Verification Code</h2>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6 text-lg">
                Your OTP for login is:
              </p>
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <span className="text-4xl font-black tracking-[0.5em] text-[#333333] ml-[0.5em]">
                  {otpToShow}
                </span>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full bg-[#1f9e9a] text-white font-bold py-4 rounded-xl hover:bg-[#1a8a86] transition-colors text-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

