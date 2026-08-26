import { motion } from "framer-motion";
import { site } from "../site";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Nosotros() {
  return (
    <section id="nosotros" className="bg-white py-32 sm:py-40">
      <div className="container-px">

        {/* Encabezado editorial */}
        <div className="max-w-3xl">
          <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-8">
            Sobre nosotros
          </motion.p>
          <motion.h2 variants={reveal} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="font-display font-extrabold text-ink leading-[1.05]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", letterSpacing: "-0.03em" }}>
            Una empresa familiar.<br />
            <span className="text-ink-muted">Dos generaciones.</span>
          </motion.h2>
        </div>

        {/* Cuerpo: texto + foto, con mucho aire */}
        <div className="mt-20 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div variants={reveal} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xl sm:text-2xl text-ink leading-relaxed font-light">
              Lo que empezó hace más de 35 años lo continúan hoy las
              siguientes generaciones, con la misma convicción: acompañar a cada
              cliente como si su negocio fuera propio.
            </p>
            <p className="mt-8 text-lg text-ink-soft leading-relaxed font-light">
              Crecimos junto a la industria de la región. Hoy combinamos la
              infraestructura y la capacidad logística de una gran compañía con
              la cercanía y el compromiso de una empresa de familia.
            </p>

            {/* Firma / detalle humano */}
            <div className="mt-12 flex items-center gap-4">
              <div className="h-px w-12 bg-ink/20" />
              <p className="text-sm text-ink-muted">
                Empresa familiar · Tucumán, Argentina
              </p>
            </div>
          </motion.div>

          {/* Foto de la familia / depósito */}
          <motion.div variants={reveal} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl bg-surface-soft overflow-hidden flex items-center justify-center">
            {/* Cuando tengas la foto: guardala como public/nosotros.jpg y descomentá */}
            {/* <img src="/nosotros.jpg" alt="La familia de ProPacking" className="absolute inset-0 w-full h-full object-cover" /> */}
            <div className="text-center px-8">
              <p className="font-display font-semibold text-ink-muted text-sm uppercase tracking-widest">Foto de la familia</p>
              <p className="text-xs text-ink-muted mt-3 max-w-[240px] leading-relaxed">
                Una foto de la familia o del equipo en el depósito. Guardala como <code className="text-ink">public/nosotros.jpg</code>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Franja de datos — sobria, respira */}
        <motion.div variants={reveal} custom={4} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-ink/8 pt-16">
          {[
            { n: "+35", l: "Años de trayectoria" },
            { n: "2", l: "Generaciones" },
            { n: "Propia", l: "Logística" },
            { n: "Mayor y menor", l: "Modalidad de venta" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display font-extrabold text-ink leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.03em" }}>
                {s.n}
              </p>
              <p className="text-sm text-ink-soft mt-3">{s.l}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
