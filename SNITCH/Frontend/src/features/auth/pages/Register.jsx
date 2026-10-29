import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import AuthLayout from "../components/AuthLayout";
import AuthField, { inputClass } from "../components/AuthField";
import PasswordField from "../components/PasswordField";
import GoogleButton from "../components/GoogleButton";
import registerImage from "../../../assets/auth-register.jpg";

const fields = [
  { name: "fullname", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "contact", label: "Contact number", type: "tel", autoComplete: "tel" },
];

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    contact: "",
    fullname: "",
    email: "",
    password: "",
    isSeller: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await handleRegister(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout image={registerImage} quote="Dress like nobody's watching. Everybody is">
      <header className="mb-[clamp(1.25rem,4.5vh,2.5rem)]">
        <h1 className="pl-[0.3em] text-[clamp(2.75rem,10vh,5.5rem)] font-light leading-none tracking-[0.3em]">
          SNITCH<span className="text-neon-rose">.</span>
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Join the{" "}
          <span className="bg-gradient-to-r from-cerulean to-neon-rose bg-clip-text text-transparent">
            drop
          </span>
          . Create your account in a minute.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-[clamp(0.75rem,2.6vh,1.75rem)]">
        {fields.map(({ name, label, type, autoComplete }) => (
          <AuthField key={name} label={label}>
            <input
              className={inputClass}
              type={type}
              name={name}
              placeholder=" "
              autoComplete={autoComplete}
              value={form[name]}
              onChange={handleChange}
              required
            />
          </AuthField>
        ))}

        <PasswordField
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <label className="flex cursor-pointer select-none items-center justify-between rounded-xl border border-white/10 px-4 py-2.5 transition-colors hover:border-white/25">
          <span>
            <span className="block text-sm text-white/80">Register as a seller</span>
            <span className="block text-xs text-white/35">List and sell your own products</span>
          </span>
          <input
            type="checkbox"
            name="isSeller"
            checked={form.isSeller}
            onChange={handleChange}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/15 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-neon-rose peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-cerulean" />
        </label>

        {error && (
          <p className="rounded-lg border border-neon-rose/30 bg-neon-rose/10 px-4 py-3 text-sm text-neon-rose">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-cerulean to-neon-rose py-3 text-sm font-medium uppercase tracking-[0.25em] text-white shadow-lg shadow-cerulean/20 transition-all duration-300 hover:shadow-neon-rose/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>

        <GoogleButton />

        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link to="/login" className="text-white transition-colors hover:text-neon-rose">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
