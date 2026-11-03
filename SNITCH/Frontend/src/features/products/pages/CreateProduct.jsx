import { useEffect, useMemo, useRef, useState } from "react";
import { useProduct } from "../hooks/useProduct";

const MAX_IMAGES = 7;
const MAX_SIZE = 5 * 1024 * 1024; // matches multer limit on the backend
const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
];

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-cerulean focus:bg-black/50";

const Label = ({ children, hint }) => (
  <div className="mb-2 flex items-baseline justify-between">
    <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">{children}</span>
    {hint && <span className="text-xs text-white/30">{hint}</span>}
  </div>
);

const CurrencySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = CURRENCIES.find((c) => c.code === value);

  return (
    <div ref={ref} className="relative w-28 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${fieldClass} flex cursor-pointer items-center justify-between gap-2 ${
          open ? "!border-cerulean !bg-black/50" : ""
        }`}
      >
        <span className="font-medium tracking-wide">{current?.code}</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-white/50 transition-transform duration-300 ${open ? "rotate-180 text-cerulean" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full right-0 z-20 mb-2 w-full origin-bottom animate-fade-up overflow-hidden rounded-xl border border-white/10 bg-jet/95 p-1 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          {CURRENCIES.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                role="option"
                aria-selected={c.code === value}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  c.code === value
                    ? "bg-gradient-to-r from-cerulean/30 to-neon-rose/20 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{c.code}</span>
                <span className="text-white/40">{c.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const main = previews[Math.min(active, previews.length - 1)];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addFiles(list) {
    setError("");
    const picked = Array.from(list || []);
    const valid = picked.filter((f) => f.type.startsWith("image/") && f.size <= MAX_SIZE);
    if (valid.length !== picked.length) setError("Only images up to 5MB are allowed.");

    setImages((prev) => {
      const next = [...prev, ...valid];
      if (next.length > MAX_IMAGES) setError(`You can upload up to ${MAX_IMAGES} images.`);
      return next.slice(0, MAX_IMAGES);
    });
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setActive(0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Add at least one image.");
      return;
    }

    setSubmitting(true);
    try {
      const product = await handleCreateProduct({ ...form, images });
      setSuccess(`"${product?.title ?? form.title}" is live.`);
      setForm({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });
      setImages([]);
      setActive(0);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0]?.msg || data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const symbol = CURRENCIES.find((c) => c.code === form.priceCurrency)?.symbol;

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-jet text-white lg:h-dvh">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 animate-drift rounded-full bg-cerulean/25 blur-[120px]" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-neon-rose/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      {/* top bar */}
      <nav className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-6">
        <span className="text-sm tracking-[0.4em]">
          SNITCH<span className="text-neon-rose">.</span>
        </span>
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-rose shadow-[0_0_8px_var(--color-neon-rose)]" />
          Seller studio
        </span>
      </nav>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 mx-auto grid min-h-0 w-full max-w-6xl flex-1 animate-fade-up gap-6 p-6 lg:grid-cols-[0.85fr_1fr]"
      >
        {/* media */}
        <section className="flex min-h-0 flex-col gap-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 lg:aspect-auto lg:min-h-0 lg:flex-1 ${
              dragging
                ? "border-cerulean bg-cerulean/10 shadow-[0_0_40px_-8px_var(--color-cerulean)]"
                : "border-white/10 bg-white/[0.03]"
            } ${main ? "" : "border-dashed"}`}
          >
            {main ? (
              <>
                <img src={main.url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] backdrop-blur">
                  {active + 1} / {images.length}
                </span>
                {/* live preview */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="truncate text-xl font-light tracking-wide">
                    {form.title || "Product title"}
                  </p>
                  <p className="mt-1 bg-gradient-to-r from-cerulean to-neon-rose bg-clip-text text-lg font-medium text-transparent">
                    {symbol}
                    {form.priceAmount || "0.00"}
                  </p>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 text-white/40 transition-colors hover:text-white/70"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-3xl font-light transition-all duration-300 group-hover:scale-110 group-hover:border-cerulean group-hover:text-cerulean">
                  +
                </span>
                <span className="text-sm">Drop images here or click to browse</span>
                <span className="text-xs text-white/25">
                  Up to {MAX_IMAGES} images · 5MB each
                </span>
              </button>
            )}
          </div>

          <div className="grid shrink-0 grid-cols-7 gap-2">
            {Array.from({ length: MAX_IMAGES }, (_, i) => {
              const p = previews[i];
              if (!p) {
                return (
                  <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Add image"
                    className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-base text-white/25 transition-colors hover:border-cerulean hover:text-cerulean"
                  >
                    +
                  </button>
                );
              }
              return (
                <div
                  key={p.url}
                  className={`group relative aspect-square overflow-hidden rounded-xl border transition-all ${
                    i === active
                      ? "border-cerulean ring-2 ring-cerulean/30"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="h-full w-full cursor-pointer"
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={p.url} alt="" className="h-full w-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black/80 text-[0.55rem] opacity-0 transition-opacity hover:bg-neon-rose group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </section>

        {/* details */}
        <section className="flex min-h-0 flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:p-7">
          <header>
            <h1 className="text-3xl font-light tracking-wide">
              New drop<span className="text-neon-rose">.</span>
            </h1>
            <p className="mt-1.5 text-sm text-white/40">
              Add photos and details, then publish to your store.
            </p>
          </header>

          <div>
            <Label hint={`${form.title.length}/100`}>Title</Label>
            <input
              className={fieldClass}
              name="title"
              placeholder="Oversized washed hoodie"
              minLength={3}
              maxLength={100}
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex min-h-32 flex-1 flex-col">
            <Label hint={`${form.description.length}/2000`}>Description</Label>
            <textarea
              className={`${fieldClass} min-h-0 flex-1 resize-none`}
              name="description"
              maxLength={2000}
              placeholder="Fabric, fit, care instructions..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Price</Label>
            <div className="flex gap-3">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                  {symbol}
                </span>
                <input
                  className={`${fieldClass} pl-9`}
                  type="number"
                  name="priceAmount"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.priceAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <CurrencySelect
                value={form.priceCurrency}
                onChange={(code) => setForm((prev) => ({ ...prev, priceCurrency: code }))}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-neon-rose/30 bg-neon-rose/10 px-4 py-2.5 text-sm text-neon-rose">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl border border-cerulean/40 bg-cerulean/10 px-4 py-2.5 text-sm text-cerulean">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-cerulean to-neon-rose py-3.5 text-sm font-medium uppercase tracking-[0.25em] shadow-lg shadow-cerulean/20 transition-all duration-300 hover:shadow-neon-rose/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish product"}
          </button>
        </section>
      </form>
    </main>
  );
};

export default CreateProduct;
