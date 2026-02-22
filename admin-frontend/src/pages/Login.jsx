import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Key, X, Leaf, ArrowRight, RefreshCw } from "lucide-react";
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { mobile });
      if (res.data.otp) { setOtpToShow(res.data.otp); setShowOtpModal(true); }
      else toast.success("OTP sent successfully");
      setOtpSent(true); setOtp(""); setTimer(30);
      const interval = setInterval(() => {
        setTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter valid 6-digit OTP"); return; }
    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { mobile, otp });
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const editMobile = () => { setOtpSent(false); setOtp(""); setTimer(0); };

  return (
    <div className="flex w-full min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 40%, #f0fdf4 70%, #f8fafc 100%)' }}>

      {/* ── Animated background orbs ── */}
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-60px) scale(1.08)} 66%{transform:translate(-30px,40px) scale(0.95)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,30px) scale(1.05)} 66%{transform:translate(35px,-50px) scale(0.92)} }
        @keyframes floatOrb3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,35px) scale(1.1)} }
        @keyframes floatOrb4 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,-30px)} }
        .orb1 { animation: floatOrb1 14s ease-in-out infinite; }
        .orb2 { animation: floatOrb2 18s ease-in-out infinite; }
        .orb3 { animation: floatOrb3 11s ease-in-out infinite; }
        .orb4 { animation: floatOrb4 16s ease-in-out infinite; }
      `}</style>

      {/* Orbs */}
      <div className="orb1 absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(31,158,154,0.18) 0%, transparent 70%)' }} />
      <div className="orb2 absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)' }} />
      <div className="orb3 absolute top-1/3 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)' }} />
      <div className="orb4 absolute top-10 right-1/3 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)' }} />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(31,158,154,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative z-10">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20"
            style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <p className="text-gray-800 font-bold text-base">EcoSyz</p>
            <p className="text-gray-400 text-xs font-medium">Smart Waste Management</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="text-5xl font-black text-gray-800 leading-tight mb-6">
            Welcome,<br />
            <span style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Admin
            </span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xs">
            Manage your panchayat's waste collection, employees, and complaints from one powerful dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              { feat: 'Real-time waste tracking', color: '#1f9e9a' },
              { feat: 'Employee attendance', color: '#22c55e' },
              { feat: 'Complaint resolution', color: '#0d9488' },
            ].map(({ feat, color }) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-gray-600 text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>

          {/* Floating stat cards */}
          <div className="mt-10 flex gap-4">
            {[
              { label: 'Wards', value: '24+' },
              { label: 'Employees', value: '180+' },
              { label: 'Daily Bins', value: '900+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm shadow-teal-100">
                <p className="text-lg font-black" style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</p>
                <p className="text-gray-400 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-xs">© 2026 EcoSyz. All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-teal-100/50 p-10">

            {/* Top teal accent line */}
            <div className="absolute inset-x-10 top-0 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #1f9e9a, #22c55e, transparent)' }} />

            {/* Logo (mobile only) */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
                <Leaf size={16} className="text-white" />
              </div>
              <p className="text-gray-800 font-bold">EcoSyz Admin</p>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-teal-200"
                style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
                {otpSent ? <Key size={20} className="text-white" /> : <Phone size={20} className="text-white" />}
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">
                {otpSent ? 'Verify OTP' : 'Sign In'}
              </h2>
              <p className="text-gray-500 text-sm">
                {otpSent
                  ? `Enter the 6-digit code sent to +91 ${mobile}`
                  : 'Enter your registered mobile number'}
              </p>
            </div>

            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              {/* Mobile */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={otpSent}
                  className="w-full h-13 rounded-xl pl-11 pr-12 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all border"
                  style={{
                    background: otpSent ? '#f8fafc' : '#ffffff',
                    border: '1.5px solid #e2e8f0',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#1f9e9a'; e.target.style.boxShadow = '0 0 0 3px rgba(31,158,154,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                {otpSent && (
                  <button type="button" onClick={editMobile}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 text-xs font-bold hover:text-teal-600">
                    Edit
                  </button>
                )}
              </div>

              {/* OTP */}
              {otpSent && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Key size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full h-13 rounded-xl pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all tracking-[0.4em]"
                    style={{ background: '#ffffff', border: '1.5px solid #e2e8f0' }}
                    onFocus={(e) => { e.target.style.borderColor = '#1f9e9a'; e.target.style.boxShadow = '0 0 0 3px rgba(31,158,154,0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-xl font-bold text-white flex items-center justify-center gap-2 mt-2 transition-all"
                style={{
                  background: loading ? 'linear-gradient(135deg, #5ba3a0, #4ead72)' : 'linear-gradient(135deg, #1f9e9a, #16a34a)',
                  boxShadow: '0 6px 20px rgba(31,158,154,0.35)',
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 10px 28px rgba(31,158,154,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(31,158,154,0.35)')}
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{otpSent ? 'Verify OTP' : 'Send OTP'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {otpSent && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={timer > 0}
                  className={`text-sm font-semibold transition-colors ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-teal-500 hover:text-teal-600'}`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── OTP Preview Modal ── */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="p-5 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}>
              <h2 className="text-white text-base font-bold">Your OTP Code</h2>
              <button onClick={() => setShowOtpModal(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm mb-5">Use this code to log in:</p>
              <div className="bg-teal-50 rounded-xl p-5 mb-5 border border-teal-100">
                <span className="text-4xl font-black tracking-[0.5em] ml-[0.5em]"
                  style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {otpToShow}
                </span>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}
              >
                Got it, Let me in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
