import { useState } from "react";
import AuthField, { inputClass } from "./AuthField";

const PasswordField = ({ value, onChange, autoComplete }) => {
  const [show, setShow] = useState(false);

  return (
    <AuthField label="Password">
      <input
        className={`${inputClass} pr-12`}
        type={show ? "text" : "password"}
        name="password"
        placeholder=" "
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute bottom-2.5 right-0 cursor-pointer text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-neon-rose"
      >
        {show ? "Hide" : "Show"}
      </button>
    </AuthField>
  );
};

export default PasswordField;
