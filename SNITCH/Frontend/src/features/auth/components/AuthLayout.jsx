const AuthLayout = ({ image, imageClass = "", quote, children }) => (
  <main className="relative flex h-dvh overflow-hidden bg-jet text-white">
    {/* image panel */}
    <aside className="relative hidden w-1/2 lg:block">
      <img
        src={image}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${imageClass}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/40 to-jet/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-jet" />
      <div className="absolute inset-0 bg-cerulean/15 mix-blend-color" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-neon-rose/25 blur-[120px]" />

      <p className="absolute bottom-[clamp(2rem,8vh,5rem)] left-[clamp(2rem,5vw,4.5rem)] max-w-sm text-[clamp(1.5rem,3.2vh,2.25rem)] font-light leading-snug">
        {quote}
        <span className="text-neon-rose">.</span>
      </p>
    </aside>

    {/* form panel */}
    <section className="relative flex flex-1 overflow-y-auto px-6 py-4">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cerulean/20 blur-[120px] animate-drift" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="relative m-auto w-full max-w-md animate-fade-up">{children}</div>
    </section>
  </main>
);

export default AuthLayout;
