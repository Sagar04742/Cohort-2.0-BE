import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../hook/useAuth";
import AuthLayout from "../components/AuthLayout";
import AuthField, { inputClass } from "../components/AuthField";
import PasswordField from "../components/PasswordField";
import GoogleButton from "../components/GoogleButton";
import loginImage from "../../../assets/auth-login.jpg";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(
    searchParams.get("error") === "google" ? "Google sign-in failed. Try again." : ""
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await handleLogin(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      image={loginImage}
      quote="Welcome back. The new drop is waiting"
    >
      <header className="mb-[clamp(1.5rem,6vh,3.5rem)]">
        <h1 className="pl-[0.3em] text-[clamp(2.75rem,10vh,5.5rem)] font-light leading-none tracking-[0.3em]">
          SNITCH<span className="text-neon-rose">.</span>
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Sign in to{" "}
          <span className="bg-gradient-to-r from-cerulean to-neon-rose bg-clip-text text-transparent">
            continue
          </span>
          .
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-[clamp(1.5rem,4.5vh,2.75rem)]">
        <AuthField label="Email">
          <input
            className={inputClass}
            type="email"
            name="email"
            placeholder=" "
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </AuthField>

        <PasswordField
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        {error && (
          <p className="rounded-lg border border-neon-rose/30 bg-neon-rose/10 px-4 py-3 text-sm text-neon-rose">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-cerulean to-neon-rose py-3.5 text-sm font-medium uppercase tracking-[0.25em] text-white shadow-lg shadow-cerulean/20 transition-all duration-300 hover:shadow-neon-rose/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <GoogleButton />

        <p className="text-center text-sm text-white/40">
          New to Snitch?{" "}
          <Link to="/register" className="text-white transition-colors hover:text-neon-rose">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
