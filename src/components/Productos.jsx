import { useState } from "react";
import { motion } from "framer-motion";
import { productos } from "../productos";
import AgroEditorial from "./AgroEditorial";
import IndustriaEditorial from "./IndustriaEditorial";
import { familiasIndustria } from "../industria";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

// Subpestañas por universo. Solo se muestran las que tienen productos.
const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "vidrio", label: "Envases" },
  { id: "agro", label: "Agro" },
  { id: "industria", label: "Industria" },
];

// Sub-pestañas de material dentro de Envases
const MATERIALES = [
  { id: "vidrio", label: "Vidrio" },
  { id: "pet", label: "PET" },
];

export default function Productos({ onOpen }) {
  const [filtro, setFiltro] = useState("todos");
  const [material, setMaterial] = useState("vidrio");

  // universos que existen realmente en el catálogo
  const universos = new Set(productos.map((p) => p.universo).filter(Boolean));
  if (familiasIndustria.length > 0) universos.add("industria");
  const filtrosVisibles = FILTROS.filter(
    (f) => f.id === "todos" || universos.has(f.id)
  );

  // Materiales que existen realmente dentro de Envases (vidrio por defecto si no tienen campo)
  const materialesExistentes = new Set(
    productos.filter((p) => p.universo === "vidrio").map((p) => p.material || "vidrio")
  );
  const materialesVisibles = MATERIALES.filter((m) => materialesExistentes.has(m.id));

  // "Todos" no incluye las familias de industria (tienen su propia vista);
  // se listan solo al entrar a la pestaña Industria.
  let lista;
  if (filtro === "todos") {
    lista = productos;
  } else if (filtro === "vidrio") {
    // dentro de Envases, filtrar por material (vidrio / pet)
    lista = productos.filter(
      (p) => p.universo === "vidrio" && (p.material || "vidrio") === material
    );
  } else {
    lista = productos.filter((p) => p.universo === filtro);
  }

  return (
    <section id="productos" className="pt-20 pb-32 sm:pt-24 sm:pb-40 bg-white">
      <div className="container-px">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-4 sm:mb-8">Productos</motion.p>
          <motion.h2 variants={reveal} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-extrabold text-ink leading-[1.02] sm:leading-[1.05]" style={{ fontSize: "clamp(1.75rem, 8vw, 3.6rem)", letterSpacing: "-0.03em" }}>
            Cada producto,<br /><span className="text-ink-muted">una experiencia.</span>
          </motion.h2>
        </div>

        {/* subpestañas / filtro por universo */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2.5 sm:gap-3 mb-9 sm:mb-14 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {filtrosVisibles.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`shrink-0 rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-[13.5px] sm:text-sm font-medium transition-all duration-300 border whitespace-nowrap ${
                filtro === f.id
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-ink-soft border-ink/15 hover:border-ink/40"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* sub-pestañas de material (Vidrio / PET) dentro de Envases */}
        {filtro === "vidrio" && materialesVisibles.length > 1 && (
          <div className="flex flex-wrap gap-2.5 -mt-8 mb-14">
            {materialesVisibles.map((m) => (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={`rounded-full px-5 py-2 text-[13.5px] font-medium transition-all duration-300 border ${
                  material === m.id
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink-soft border-ink/15 hover:border-ink/40"
                }`}>
                {m.label}
              </button>
            ))}
          </div>
        )}

        {filtro === "industria" ? (
          <IndustriaEditorial />
        ) : filtro === "agro" ? (
          <AgroEditorial productos={lista} onOpen={onOpen} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lista.map((p, i) => (
              <motion.button key={p.id} onClick={() => onOpen(p.id)}
                variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
                className="group text-left rounded-[22px] sm:rounded-3xl bg-surface-soft overflow-hidden shadow-card sm:shadow-none hover:shadow-cardHover transition-all duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/3] sm:aspect-square flex items-center justify-center p-6 sm:p-10 overflow-hidden">
                  <img src={p.hero} alt={p.nombre} loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 pt-1 sm:p-8 sm:pt-2">
                  <p className="text-xs text-ink-muted uppercase tracking-wider">{p.categoria}</p>
                  <h3 className="font-display font-bold text-ink text-lg sm:text-xl mt-1">{p.nombre}</h3>
                  <span className="inline-flex items-center gap-1.5 mt-3 sm:mt-4 text-sm text-ink-soft group-hover:text-ink transition-colors">
                    Explorar <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
