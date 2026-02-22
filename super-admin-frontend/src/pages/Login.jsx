import { useState } from "react";
import { Lock, Leaf, X, Phone, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

export default function Login({ onLoginSuccess }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpToShow, setOtpToShow] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => setPopup({ show: true, message, type });
  const closePopup = () => setPopup({ show: false, message: "", type: "success" });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { showPopup("Please enter a valid 10-digit mobile number", "error"); return; }
    setLoading(true);
    try {
      if (step === 1) {
        const res = await api.post("/auth/send-otp", { mobile });
        if (res.data.otp) { setOtpToShow(res.data.otp); setShowOtpModal(true); }
        else showPopup("OTP sent to your registered number");
        setStep(2);
      } else {
        await api.post("/auth/verify-otp", { mobile, otp: password });
        await api.get("/company/dashboard");
        showPopup("Login successful! Welcome back.");
        setTimeout(onLoginSuccess, 900);
      }
    } catch (err) {
      showPopup(err.response?.data?.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { mobile });
      if (res.data.otp) { setOtpToShow(res.data.otp); setShowOtpModal(true); }
      else showPopup("OTP resent successfully");
    } catch { showPopup("Failed to resend OTP", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 900, margin: "0 16px", borderRadius: 20, overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.18)", display: "flex", minHeight: 560 }}>

        {/* ── Left Panel ── */}
        <div style={{ flex: 1, background: "#0f172a", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px" }}>
          {/* Floating circles */}
          <div className="animate-float"  style={{ position:"absolute", top:"10%",  left:"15%",  width:180, height:180, borderRadius:"50%", background:"rgba(99,102,241,0.15)" }} />
          <div className="animate-float2" style={{ position:"absolute", bottom:"15%",right:"-5%", width:220, height:220, borderRadius:"50%", background:"rgba(139,92,246,0.12)" }} />
          <div className="animate-float3" style={{ position:"absolute", top:"50%",  right:"20%", width:100, height:100, borderRadius:"50%", background:"rgba(99,102,241,0.1)"  }} />

          <div style={{ position:"relative", zIndex:1 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:40 }}>
              <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(99,102,241,0.5)" }}>
                <Leaf size={26} color="white" />
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:"white", letterSpacing:"-0.5px" }}>EcoSyz</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>Smart Waste Management</div>
              </div>
            </div>

            <h1 style={{ fontSize:32, fontWeight:800, color:"white", lineHeight:1.25, marginBottom:14, letterSpacing:"-0.5px" }}>
              Welcome back,<br />
              <span style={{ background:"linear-gradient(90deg,#818cf8,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Super Admin</span>
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:36 }}>
              Sign in to manage panchayat registrations, subscriptions, payments, and support queries across the EcoSyz network.
            </p>

            {/* Feature bullets */}
            {[
              "Panchayat verification & approval",
              "Subscription plan management",
              "Payment monitoring dashboard",
              "Support ticket resolution",
            ].map((f) => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:20, height:20, borderRadius:6, background:"rgba(99,102,241,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#818cf8" }} />
                </div>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ width:400, background:"white", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 40px", flexShrink:0 }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#0f172a", marginBottom:6 }}>
              {step === 1 ? "Sign In" : "Verify OTP"}
            </div>
            <div style={{ fontSize:13, color:"#94a3b8" }}>
              {step === 1 ? "Enter your registered mobile number to continue" : `OTP sent to +91 ${mobile}`}
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Mobile */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Mobile Number</label>
              <div style={{ position:"relative" }}>
                <Phone size={16} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: step===2 ? "#cbd5e1" : "#94a3b8" }} />
                <input
                  type="tel" inputMode="numeric" pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={mobile} disabled={step === 2}
                  onChange={(e) => { const v = e.target.value.replace(/\D/g,""); if(v.length<=10) setMobile(v); }}
                  style={{ width:"100%", paddingLeft:42, paddingRight:14, paddingTop:12, paddingBottom:12, border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, color: step===2 ? "#9ca3af" : "#0f172a", background: step===2 ? "#f9fafb" : "white", fontFamily:"inherit", outline:"none" }}
                  onFocus={e => { if(step!==2) e.target.style.borderColor="#6366f1"; }}
                  onBlur={e => e.target.style.borderColor="#e2e8f0"}
                />
              </div>
            </div>

            {/* OTP */}
            <div style={{ marginBottom:8 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>
                {step === 1 ? "OTP" : "Enter OTP"}
              </label>
              <div style={{ position:"relative" }}>
                <Lock size={16} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: step===1 ? "#cbd5e1" : "#94a3b8" }} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={step === 1 ? "Will be sent after mobile entry" : "6-digit OTP"}
                  value={password} disabled={step === 1}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width:"100%", paddingLeft:42, paddingRight:44, paddingTop:12, paddingBottom:12, border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, color: step===1 ? "#9ca3af" : "#0f172a", background: step===1 ? "#f9fafb" : "white", fontFamily:"inherit", outline:"none" }}
                  onFocus={e => { if(step!==1) e.target.style.borderColor="#6366f1"; }}
                  onBlur={e => e.target.style.borderColor="#e2e8f0"}
                />
                {step === 2 && (
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>

            {/* Step 2 helpers */}
            {step === 2 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16, marginTop:8 }}>
                <button type="button" onClick={() => { setStep(1); setPassword(""); }}
                  style={{ fontSize:12, color:"#6366f1", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  ← Edit number
                </button>
                <button type="button" onClick={resendOtp} disabled={loading}
                  style={{ fontSize:12, color:"#6366f1", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", opacity: loading ? 0.5 : 1 }}>
                  Resend OTP
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{ width:"100%", padding:"13px", borderRadius:10, border:"none", cursor: loading ? "not-allowed" : "pointer", fontFamily:"inherit", fontSize:14, fontWeight:700, color:"white", background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: loading ? "none" : "0 4px 15px rgba(99,102,241,0.4)", marginTop: step===1 ? 24 : 0, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            >
              {loading ? (
                <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", borderRadius:"50%" }} className="spinner" /> Processing…</>
              ) : step === 1 ? "Send OTP" : "Verify & Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Popup */}
      {popup.show && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:"white", borderRadius:16, padding:"28px 32px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", textAlign:"center", minWidth:280 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background: popup.type==="error" ? "#fef2f2" : "#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <span style={{ fontSize:22 }}>{popup.type==="error" ? "✕" : "✓"}</span>
            </div>
            <p style={{ fontWeight:600, color: popup.type==="error" ? "#dc2626" : "#16a34a", marginBottom:16, fontSize:15 }}>{popup.message}</p>
            <button onClick={closePopup} style={{ padding:"8px 24px", borderRadius:8, border:"none", background: popup.type==="error" ? "#dc2626" : "#16a34a", color:"white", fontWeight:600, cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>OK</button>
          </div>
        </div>
      )}

      {/* OTP Display Modal */}
      {showOtpModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:"white", borderRadius:20, boxShadow:"0 25px 70px rgba(0,0,0,0.2)", width:"100%", maxWidth:400, overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:"white" }}>Your OTP Code</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Use this to complete sign in</div>
              </div>
              <button onClick={() => setShowOtpModal(false)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <X size={18} color="white" />
              </button>
            </div>
            <div style={{ padding:"32px 24px", textAlign:"center" }}>
              <div style={{ background:"#f8fafc", borderRadius:12, padding:"20px 24px", border:"1.5px dashed #e2e8f0", marginBottom:24 }}>
                <div style={{ fontSize:42, fontWeight:800, letterSpacing:"0.4em", color:"#0f172a", fontVariantNumeric:"tabular-nums" }}>{otpToShow}</div>
              </div>
              <p style={{ fontSize:13, color:"#94a3b8", marginBottom:20 }}>Paste this OTP in the verification field to sign in.</p>
              <button onClick={() => setShowOtpModal(false)} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"white", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                Got it, continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
