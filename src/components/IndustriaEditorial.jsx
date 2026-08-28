import { useState } from "react";
import { motion } from "framer-motion";
import { familiasIndustria } from "../industria";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function IndustriaEditorial() {
  const familias = familiasIndustria;
  const [activa, setActiva] = useState(familias[0]?.id);
  const familia = familias.find((f) => f.id === activa) || familias[0];

  if (!familia) return null;

  return (
    <div>
      {/* Sub-pestañas de familias */}
      <div className="flex flex-wrap gap-2.5 mb-10">
        {familias.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiva(f.id)}
            className={`rounded-full px-5 py-2 text-[13.5px] font-medium transition-all duration-300 border ${
              activa === f.id
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink-soft border-ink/15 hover:border-ink/40"
            }`}>
            {f.nombre}
          </button>
        ))}
      </div>

      {/* Encabezado de la familia activa */}
      <motion.div
        key={familia.id + "-head"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 max-w-2xl">
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-muted">
          {familia.categoria}
        </span>
        <h3
          className="font-serif text-ink leading-[1] mt-2 mb-3"
          style={{ fontSize: "clamp(1.9rem, 3vw, 2.8rem)", letterSpacing: "-0.02em" }}>
          {familia.nombre}
        </h3>
        <p className="text-ink-soft text-[14.5px] leading-relaxed">{familia.tagline}</p>
      </motion.div>

      {/* Grilla de variantes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {familia.variantes.map((v, i) => (
          <motion.div
            key={v.id}
            variants={reveal}
            custom={i}
            initial="hidden"
            animate="show"
            className="group rounded-3xl bg-surface-soft overflow-hidden hover:shadow-cardHover transition-all duration-500 hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={v.foto}
                alt={v.nombre}
                loading="lazy"
                className="h-full w-full object-cover object-right transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h4 className="font-display font-semibold text-ink text-base leading-snug mb-4">
                {v.nombre}
              </h4>
              <dl className="space-y-3 text-[13px] leading-relaxed">
                <div>
                  <dt className="text-ink-muted uppercase tracking-wide text-[10.5px] font-medium mb-0.5">Aplicación</dt>
                  <dd className="text-ink-soft">{v.aplicacion}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted uppercase tracking-wide text-[10.5px] font-medium mb-0.5">Beneficio</dt>
                  <dd className="text-ink-soft">{v.beneficio}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted uppercase tracking-wide text-[10.5px] font-medium mb-0.5">Presentación</dt>
                  <dd className="text-ink-soft">{v.presentacion}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
