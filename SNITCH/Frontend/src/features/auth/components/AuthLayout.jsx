const AuthLayout = ({ image, imageClass = "", quote, children }) => {
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
  <main className="relative flex h-dvh overflow-hidden bg-jet text-white">
    {/* image panel */}
    <aside className="relative hidden w-1/2 overflow-hidden border-r border-white/15 lg:block">
      <img
        src={image}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-[50%_30%] grayscale contrast-[1.15] brightness-[0.8] ${imageClass}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.6)]" />

      <div className="absolute left-[clamp(1.5rem,3vw,2.75rem)] top-[clamp(1.5rem,3vh,2.5rem)] text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
        SNITCH
      </div>

      <div className="absolute bottom-[clamp(1.5rem,6vh,3.5rem)] left-[clamp(1.5rem,3vw,2.75rem)] max-w-sm">
        <span className="mb-4 block h-px w-12 bg-white/50" />
        <p className="text-[clamp(1.5rem,3.2vh,2.25rem)] font-light leading-snug tracking-wide">
          {quote}
          <span className="text-neon-rose">.</span>
        </p>
      </div>
    </aside>

    {/* form panel */}
    <section onMouseMove={handleMove} className="relative flex flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cerulean/20 blur-[120px] animate-drift" />
        <div className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-neon-rose/10 blur-[120px]" />
        {/* base grid, barely there */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* same grid, lit up around the cursor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff40_1px,transparent_1px),linear-gradient(to_bottom,#ffffff40_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,40%),black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,40%),rgba(255,255,255,0.05),transparent)]" />
      </div>

      <div className="relative m-auto w-full max-w-md animate-fade-up">{children}</div>
    </section>
  </main>
  );
};

export default AuthLayout;
