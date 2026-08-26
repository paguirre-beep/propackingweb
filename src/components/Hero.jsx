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

      {/* strip inferior de datos */}
      <motion.div variants={rise} custom={4} initial="hidden" animate="show"
        className="absolute bottom-0 inset-x-0 z-10 border-t border-ink/8 bg-white/70 backdrop-blur-sm">
        <div className="container-px py-5 flex flex-wrap gap-x-10 gap-y-3 text-sm text-ink-soft">
          <span><span className="text-ink font-semibold">Stock</span> permanente</span>
          <span><span className="text-ink font-semibold">Logística</span> propia</span>
          <span><span className="text-ink font-semibold">Atención</span> personalizada</span>
          <span className="hidden sm:inline"><span className="text-ink font-semibold">Venta</span> por mayor y menor</span>
        </div>
      </motion.div>
    </section>
  );
}
