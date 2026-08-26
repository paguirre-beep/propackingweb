import { motion } from "framer-motion";
import { productos } from "../productos";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Productos({ onOpen }) {
  return (
    <section id="productos" className="pt-20 pb-32 sm:pt-24 sm:pb-40 bg-white">
      <div className="container-px">
        <div className="max-w-3xl mb-20">
          <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-8">Productos</motion.p>
          <motion.h2 variants={reveal} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-extrabold text-ink leading-[1.05]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", letterSpacing: "-0.03em" }}>
            Cada producto,<br /><span className="text-ink-muted">una experiencia.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p, i) => (
            <motion.button key={p.id} onClick={() => onOpen(p.id)}
              variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
              className="group text-left rounded-3xl bg-surface-soft overflow-hidden hover:shadow-cardHover transition-all duration-500 hover:-translate-y-1">
              <div className="relative aspect-square flex items-center justify-center p-10 overflow-hidden">
                <img src={p.hero} alt={p.nombre} loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-8 pt-2">
                <p className="text-xs text-ink-muted uppercase tracking-wider">{p.categoria}</p>
                <h3 className="font-display font-bold text-ink text-xl mt-1">{p.nombre}</h3>
                <span className="inline-flex items-center gap-1.5 mt-4 text-sm text-ink-soft group-hover:text-ink transition-colors">
                  Explorar <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
