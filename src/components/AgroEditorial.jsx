import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Eyebrow({ texto = "Agro" }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-muted">
      {texto}
    </span>
  );
}

function ExplorarLink({ className = "" }) {
  return (
    <span
      className={`inline-flex flex-col items-start text-sm font-medium text-ink-soft group-hover:text-ink transition-colors ${className}`}>
      <span className="inline-flex items-center gap-2">
        Explorar categoría
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
      <span className="mt-1 block h-px w-14 bg-gold/70 group-hover:w-20 transition-all duration-300" />
    </span>
  );
}

/* Tarjeta grande destacada (columna izquierda, altura completa) */
function FeaturedCard({ producto, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(producto.id)}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative flex flex-col text-left w-full h-full min-h-[560px] lg:min-h-[760px]
                 rounded-[28px] overflow-hidden bg-surface-soft
                 hover:shadow-cardHover transition-all duration-500">
      {/* Imagen de fondo ambientada */}
      <div className="absolute inset-0">
        <img
          src={producto.heroEditorial || producto.hero}
          alt={producto.nombre}
          loading="lazy"
          className="h-full w-full object-cover object-right
                     transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        {/* Velo muy sutil solo para asegurar contraste del texto a la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/5 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-[60%] p-9 lg:p-12">
        <Eyebrow texto={producto.categoria} />
        <h3
          className="font-serif text-ink leading-[0.95] mt-4 mb-5"
          style={{ fontSize: "clamp(2.6rem, 4.4vw, 4.4rem)", letterSpacing: "-0.02em" }}>
          {producto.nombre}
        </h3>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-sm mb-8">
          {producto.tagline}
        </p>
        <ExplorarLink />
      </div>
    </motion.button>
  );
}

/* Tarjeta secundaria (columna derecha): texto a la izquierda, imagen a la derecha, sin superposición */
function SideCard({ producto, onOpen, i }) {
  return (
    <motion.button
      onClick={() => onOpen(producto.id)}
      variants={reveal}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative flex text-left w-full flex-1 min-h-[230px]
                 rounded-[28px] overflow-hidden bg-surface-soft
                 hover:shadow-cardHover transition-all duration-500">
      {/* Texto — zona izquierda propia */}
      <div className="relative z-10 flex flex-col justify-center w-[48%] shrink-0 p-7 lg:p-8">
        <Eyebrow texto={producto.categoria} />
        <h3
          className="font-serif text-ink leading-[1.05] mt-2.5 mb-2.5"
          style={{ fontSize: "clamp(1.45rem, 2vw, 2.1rem)", letterSpacing: "-0.02em" }}>
          {producto.nombre}
        </h3>
        <p className="text-ink-soft text-[13px] leading-relaxed mb-5 line-clamp-3">
          {producto.tagline}
        </p>
        <ExplorarLink />
      </div>

      {/* Imagen — zona derecha propia */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={producto.heroEditorial || producto.hero}
          alt={producto.nombre}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-right
                     transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]
                     ${producto.heroEditorial ? "object-cover" : "object-contain p-4"}`}
        />
        {/* Fundido suave del borde izquierdo de la imagen hacia el fondo de la tarjeta */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-soft to-transparent" />
      </div>
    </motion.button>
  );
}

export default function AgroEditorial({ productos, onOpen }) {
  if (!productos.length) return null;

  const [destacado, ...resto] = productos;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Columna izquierda: destacado grande */}
      <FeaturedCard producto={destacado} onOpen={onOpen} />

      {/* Columna derecha: resto apilado */}
      <div className="flex flex-col gap-6">
        {resto.map((p, i) => (
          <SideCard key={p.id} producto={p} onOpen={onOpen} i={i} />
        ))}
      </div>
    </div>
  );
}
