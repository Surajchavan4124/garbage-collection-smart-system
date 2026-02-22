import { AlertTriangle, PhoneCall, Mail, RefreshCw } from "lucide-react";

export default function SubscriptionExpiredOverlay({ planName, expiredOn }) {
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15,23,42,0.92)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        background: "white", borderRadius: 24,
        boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
        width: "100%", maxWidth: 500, overflow: "hidden",
      }}>
        {/* Red alert banner */}
        <div style={{
          background: "linear-gradient(135deg,#ef4444,#dc2626)",
          padding: "28px 32px", textAlign: "center",
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <AlertTriangle size={32} color="white" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6 }}>
            Subscription Expired
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Your access to EcoSyz Admin has been suspended
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          {/* Info card */}
          <div style={{
            background: "#fef2f2", border: "1.5px solid #fecaca",
            borderRadius: 14, padding: "16px 20px", marginBottom: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Plan</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{planName || "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Expired On</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#dc2626" }}>{fmtDate(expiredOn)}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
              Your subscription has expired and the 7-day grace period has ended. All admin functions are locked until your subscription is renewed.
            </div>
          </div>

          <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16, textAlign: "center" }}>
            Contact EcoSyz to renew your subscription
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="tel:+911234567890"
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: 12, textDecoration: "none",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PhoneCall size={17} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Call Support</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>+91 12345 67890 · Mon–Sat 9AM – 6PM</div>
              </div>
            </a>

            <a href="mailto:support@ecosyz.in"
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                background: "#f8fafc", border: "1.5px solid #e2e8f0",
                borderRadius: 12, textDecoration: "none",
              }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={17} color="#6366f1" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Email Us</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>support@ecosyz.in</div>
              </div>
            </a>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20 }}>
            <RefreshCw size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            Once renewed, refresh this page to regain access
          </p>
        </div>
      </div>
    </div>
  );
}
