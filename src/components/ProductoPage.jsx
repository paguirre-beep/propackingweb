import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { whatsappLink, site } from "../site";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProductoPage({ producto, onBack }) {
  return (
    <div className="bg-white">
      {/* Barra volver */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink/8">
        <div className="container-px h-16 flex items-center">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft size={18} /> Volver
          </button>
        </div>
      </div>

      {/* HERO del producto */}
      <section className="min-h-screen flex items-center pt-16 bg-surface-soft">
        <div className="container-px grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          <motion.div variants={reveal} initial="hidden" animate="show">
            <p className="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-6">{producto.categoria}</p>
            <h1 className="font-display font-extrabold text-ink leading-[0.98]" style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", letterSpacing: "-0.04em" }}>
              {producto.nombre}
            </h1>
            <p className="mt-8 text-xl text-ink-soft font-light leading-relaxed max-w-lg">{producto.tagline}</p>
            <div className="mt-10">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-8 py-4 text-[15px] font-medium hover:bg-navy transition-colors">
                Consultar por este producto
              </a>
            </div>
          </motion.div>
          <motion.div variants={scaleIn} initial="hidden" animate="show" className="relative">
            <img src={producto.hero} alt={producto.nombre} className="w-full max-h-[70vh] object-contain drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* DETALLES / MACROS — scroll cinematográfico */}
      {producto.detalles?.map((d, i) => (
        <section key={i} className={`py-24 sm:py-32 ${i % 2 === 0 ? "bg-white" : "bg-surface-soft"}`}>
          <div className={`container-px grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <motion.div variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-soft flex items-center justify-center p-6">
              <img src={d.src} alt={d.titulo} className="max-w-full max-h-full object-contain" />
            </motion.div>
            <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
              <h2 className="font-display font-bold text-ink leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}>
                {d.titulo}
              </h2>
              <p className="mt-6 text-lg text-ink-soft font-light leading-relaxed max-w-md">{d.texto}</p>
            </motion.div>
          </div>
        </section>
      ))}

      {/* FICHA TÉCNICA */}
      <section className="py-24 sm:py-32 bg-ink text-white">
        <div className="container-px">
          <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-bold leading-tight mb-16" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
            Ficha técnica
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {producto.specs.map((s, i) => (
              <motion.div key={s.label} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }} className="border-t border-white/15 pt-5">
                <p className="text-sm text-white/50">{s.label}</p>
                <p className="text-lg font-medium mt-1">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APLICACIONES */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container-px">
          <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-6">Aplicaciones</motion.p>
          <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-bold text-ink leading-tight max-w-2xl" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
            Pensado para acompañar tu producto.
          </motion.h2>
          <div className="mt-14 flex flex-wrap gap-3">
            {producto.aplicaciones.map((a, i) => (
              <motion.span key={a} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-[15px] text-ink-soft">
                {a}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* EN USO (versiones con contenido) */}
      {producto.usos?.length > 0 && (
        <section className="py-24 sm:py-32 bg-surface-soft">
          <div className="container-px">
            <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="font-display font-bold text-ink leading-tight mb-14 max-w-2xl" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
              En uso.
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {producto.usos.map((u, i) => (
                <motion.div key={u.nombre} variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.1 }} className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-surface-soft flex items-center justify-center">
                  <img src={u.src} alt={u.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <p className="absolute bottom-6 left-6 text-white font-display font-semibold text-xl">{u.nombre}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="py-28 sm:py-36 bg-white">
        <div className="container-px text-center">
          <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-extrabold text-ink leading-[1.05] max-w-3xl mx-auto" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}>
            ¿Te interesa este producto?
          </motion.h2>
          <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-6 text-lg text-ink-soft font-light">Consultanos por precios, disponibilidad y cantidades.</motion.p>
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-8 py-4 text-[15px] font-medium hover:bg-navy transition-colors">
              Hablar por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
