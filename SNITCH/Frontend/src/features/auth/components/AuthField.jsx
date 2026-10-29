export const inputClass =
  "peer w-full bg-transparent pb-2 pt-3 text-white outline-none";

const AuthField = ({ label, children }) => (
  <div className="group relative">
    {children}
    <label className="pointer-events-none absolute left-0 top-3 origin-left text-sm text-white/40 transition-all duration-300 peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-cerulean peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:scale-85 peer-autofill:-translate-y-6 peer-autofill:scale-85">
      {label}
    </label>
    <span className="absolute bottom-0 left-0 h-px w-full bg-white/15" />
    <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cerulean to-neon-rose transition-transform duration-500 group-focus-within:scale-x-100" />
  </div>
);

export default AuthField;
