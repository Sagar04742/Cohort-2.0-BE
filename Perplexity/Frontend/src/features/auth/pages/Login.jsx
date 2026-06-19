import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M2 6.5l10 7 10-7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="4" y="10.5" width="16" height="10" rx="2.2"/><path d="M7.5 10.5V7.4a4.5 4.5 0 119 0v3.1"/>
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);
const IconSparkle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/>
  </svg>
);

const ACCENT        = "#44C7D4";
const ACCENT_DIM    = "rgba(68,199,212,0.10)";
const ACCENT_BORDER = "rgba(68,199,212,0.30)";

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: "spin 0.7s linear infinite" }}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(13,13,13,0.25)" strokeWidth="3" />
    <path d="M21 12a9 9 0 00-9-9" fill="none" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </svg>
);

// Reusable labeled input with icon + brand focus glow
const FieldInput = ({ label, icon, type, value, onChange, placeholder, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 12.5, fontWeight: 500,
        color: "rgba(255,255,255,0.45)", marginBottom: 7, letterSpacing: 0.1,
      }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "10px 13px", borderRadius: 10,
        background: "rgba(255,255,255,0.035)",
        border: `1px solid ${focused ? ACCENT_BORDER : "rgba(255,255,255,0.09)"}`,
        boxShadow: focused ? `0 0 0 3px ${ACCENT_DIM}` : "none",
        transition: "all 0.15s ease",
      }}>
        <span style={{ color: focused ? ACCENT : "rgba(255,255,255,0.3)", flexShrink: 0, transition: "color 0.15s" }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontSize: 14, color: "rgba(255,255,255,0.92)", fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  const user    = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // ✅ prevent double-submit
    setFormError("");
    setSubmitting(true);
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setFormError("Couldn't sign you in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0D0D0D", padding: "24px",
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* ambient glow */}
      <div style={{
        position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
        width: 420, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(68,199,212,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 380, width: "100%", position: "relative",
        background: "#121212", borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "34px 30px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}>
        {/* Brand mark — signature element: breathing agent pulse */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 26 }}>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <style>{`
              @keyframes pulse-ring {
                0%   { transform: scale(1);   opacity: 0.5; }
                70%  { transform: scale(1.9); opacity: 0; }
                100% { transform: scale(1.9); opacity: 0; }
              }
            `}</style>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 14,
              border: `1.5px solid ${ACCENT}`, animation: "pulse-ring 2.4s ease-out infinite",
            }} />
            <div style={{
              width: 42, height: 42, borderRadius: 12, position: "relative",
              background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT,
            }}>
              <IconSparkle />
            </div>
          </div>
          <h1 style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: 0 }}>
            Perplexity
          </h1>
        </div>

        <h2 style={{
          fontSize: 21, fontWeight: 600, color: "#fff",
          textAlign: "center", margin: "0 0 6px", letterSpacing: -0.3,
        }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 0 28px" }}>
          Sign in to continue your conversation
        </p>

        <form onSubmit={handleSubmit}>
          <FieldInput
            label="Email" icon={<IconMail />} type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email"
          />
          <FieldInput
            label="Password" icon={<IconLock />} type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password"
          />

          {formError && (
            <p style={{ fontSize: 12.5, color: "#f87171", margin: "-6px 0 16px", textAlign: "center" }}>
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "11px 16px", borderRadius: 10, border: "none",
              background: submitting ? "rgba(68,199,212,0.5)" : ACCENT,
              color: "#0D0D0D", fontSize: 14, fontWeight: 600,
              cursor: submitting ? "default" : "pointer",
              transition: "all 0.15s ease",
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {submitting ? <Spinner /> : <>Sign in <IconArrow /></>}
          </button>
        </form>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          New here?{" "}
          <Link to="/register" style={{ color: ACCENT, textDecoration: "none", fontWeight: 500 }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;