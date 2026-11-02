import { motion } from "framer-motion";
import { site, whatsappLink } from "../site";

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center bg-white overflow-hidden">
      {/* video de fondo — en todos los dispositivos; mobile recibe la versión liviana */}
      <div aria-hidden className="absolute inset-0 z-0">
        <img
          src="/video/hero-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-poster.jpg"
          preload="metadata"
        >
          {/* mobile: 720p liviano */}
          <source src="/video/hero-mobile.webm" type="video/webm" media="(max-width: 1023px)" />
          <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 1023px)" />
          {/* desktop: 1080p */}
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* velo blanco degradado: garantiza legibilidad del titular oscuro */}
      <div aria-hidden className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/85 to-white/30 lg:from-white lg:via-white/80 lg:to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 z-[1] bg-gradient-to-t from-white/90 to-transparent" />

      <div className="container-px relative z-10 w-full">
        <div className="max-w-2xl py-32">
          <motion.p variants={rise} initial="hidden" animate="show"
            className="text-sm font-medium tracking-[0.2em] text-navy uppercase mb-8">
            Más de 35 años junto a la industria
          </motion.p>

          <motion.h1 variants={rise} custom={1} initial="hidden" animate="show"
            className="font-display font-extrabold text-ink leading-[0.98]"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)", letterSpacing: "-0.04em" }}>
            Todo lo que tu empresa<br />necesita para producir<br />y embalar,{" "}
            <span className="text-ink-muted">en un solo lugar.</span>
          </motion.h1>

          <motion.p variants={rise} custom={2} initial="hidden" animate="show"
            className="mt-10 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-xl font-light">
            Estructura real, stock permanente y logística propia.
            Soluciones para agroindustria, comercios, exportadores y emprendedores.
          </motion.p>

          <motion.div variants={rise} custom={3} initial="hidden" animate="show" className="mt-12 flex flex-wrap gap-4">
            <a href="#productos"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-8 py-4 text-[15px] font-medium transition-all duration-300 hover:bg-navy hover:-translate-y-0.5">
              Ver productos
              <span aria-hidden>&rarr;</span>
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/60 backdrop-blur text-ink px-8 py-4 text-[15px] font-medium transition-all duration-300 hover:border-ink/40 hover:-translate-y-0.5">
              Hablar por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      {/* strip inferior de datos — ESCRITORIO (tira horizontal, igual que siempre) */}
      <motion.div variants={rise} custom={4} initial="hidden" animate="show"
        className="hidden lg:block absolute bottom-0 inset-x-0 z-10 border-t border-ink/8 bg-white/70 backdrop-blur-sm">
        <div className="container-px py-5 flex flex-wrap gap-x-10 gap-y-3 text-sm text-ink-soft">
          <span><span className="text-ink font-semibold">Stock</span> permanente</span>
          <span><span className="text-ink font-semibold">Logística</span> propia</span>
          <span><span className="text-ink font-semibold">Atención</span> personalizada</span>
          <span><span className="text-ink font-semibold">Venta</span> por mayor y menor</span>
        </div>
      </motion.div>

      {/* beneficios — MOBILE (tarjetas 2×2 con íconos) */}
      <div className="lg:hidden px-5 pt-2 pb-8">
        <div className="rounded-[20px] bg-[#F5F6F7] p-3 grid grid-cols-2 gap-2.5">
          {[
            { t: "Stock permanente", d: "Siempre disponible para tu operación.",
              icon: <><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></> },
            { t: "Logística propia", d: "Entregas rápidas y seguras en todo el país.",
              icon: <><rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></> },
            { t: "Atención personalizada", d: "Te asesoramos en cada etapa de tu proyecto.",
              icon: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></> },
            { t: "Venta por mayor y menor", d: "Comprás la cantidad que tu negocio necesita.",
              icon: <><path d="M3 9h18l-1.5 10.5a1 1 0 0 1-1 .9H5.5a1 1 0 0 1-1-.9L3 9z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></> },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-white p-3.5 flex flex-col gap-1.5 border border-ink/5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-navy/5 text-navy">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{b.icon}</svg>
              </span>
              <span className="font-display font-semibold text-ink text-[13.5px] leading-tight mt-0.5">{b.t}</span>
              <span className="text-[11.5px] text-ink-soft leading-snug">{b.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
