import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { familiasIndustria } from "../industria";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Portada de Industria: banner grande con foto del depósito + botón Ver productos */
function Portada({ onEnter }) {
  return (
    <motion.button
      onClick={onEnter}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex w-full text-left rounded-[32px] overflow-hidden
                 min-h-[420px] lg:min-h-[520px] hover:shadow-cardHover transition-all duration-500">
      {/* Foto de fondo */}
      <div className="absolute inset-0">
        <img
          src="/productos/film-stretch/hero.jpg"
          alt="Industria"
          className="h-full w-full object-cover object-center
                     transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/55 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-center max-w-[60%] p-10 lg:p-16">
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink-muted">
          Universo
        </span>
        <h3
          className="font-serif text-ink leading-[0.95] mt-4 mb-5"
          style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", letterSpacing: "-0.02em" }}>
          Industria
        </h3>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-md mb-9">
          Film, flejes, cintas, cartón y todo lo que tu operación necesita para
          embalar, proteger y despachar con eficiencia.
        </p>
        <span
          className="inline-flex items-center gap-2.5 self-start rounded-full bg-ink text-white
                     px-7 py-3.5 text-sm font-medium transition-all duration-300
                     group-hover:gap-4 group-hover:shadow-lg">
          Ver productos
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </motion.button>
  );
}

/* Vista de productos: sub-pestañas de familias + grilla de variantes */
function Productos({ onBack }) {
  const familias = familiasIndustria;
  const [activa, setActiva] = useState(familias[0]?.id);
  const familia = familias.find((f) => f.id === activa) || familias[0];
  if (!familia) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      {/* Volver a la portada */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors mb-8">
        <span aria-hidden>&larr;</span> Volver a Industria
      </button>

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
    </motion.div>
  );
}

export default function IndustriaEditorial() {
  const [entrado, setEntrado] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {entrado ? (
        <Productos key="productos" onBack={() => setEntrado(false)} />
      ) : (
        <div key="portada">
          <Portada onEnter={() => setEntrado(true)} />
        </div>
      )}
    </AnimatePresence>
  );
}
