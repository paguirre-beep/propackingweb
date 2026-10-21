import { motion } from "framer-motion";

const marcas = [
  { id: "propelsa", nombre: "Propelsa", desc: "Esquineros de protección para cargas" },
  { id: "wassington", nombre: "Wassington", desc: "Ceras y recubrimientos para frutas" },
  { id: "cersa", nombre: "CERSA", desc: "Insumos enológicos y pegamentos" },
  { id: "cepindus", nombre: "Cepindus", desc: "Cepillos industriales" },
  { id: "exincor", nombre: "Exincor", desc: "Fábrica de cajas de cartón" },
];

export default function Representantes() {
  return (
    <section className="bg-white border-t border-ink/8">
      <div className="container-px py-14 sm:py-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] uppercase tracking-[0.24em] text-ink-soft/70 mb-9 sm:mb-11">
          Representantes oficiales de
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-[900px] grid grid-cols-2 gap-x-8 gap-y-10 place-items-start justify-items-center
                     sm:flex sm:flex-wrap sm:justify-between sm:items-start sm:gap-x-4 lg:gap-x-6">
          {marcas.map((m) => (
            <div
              key={m.id}
              className="group flex flex-col items-center text-center
                         w-full sm:w-auto sm:flex-1 sm:max-w-[190px]">
              {/* logo (gris base + color en hover) */}
              <div className="relative flex items-center justify-center h-[52px] sm:h-[58px] w-full">
                <img
                  src={`/logos/${m.id}-gris.png`}
                  alt={m.nombre}
                  className="max-h-full w-auto object-contain opacity-[0.62]
                             transition-all duration-300 ease-out
                             group-hover:opacity-0 group-hover:scale-[1.03]"
                />
                <img
                  src={`/logos/${m.id}-color.png`}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 m-auto max-h-full w-auto object-contain opacity-0
                             transition-all duration-300 ease-out
                             group-hover:opacity-100 group-hover:scale-[1.03]"
                />
              </div>
              {/* descripción */}
              <p className="mt-3 text-[11px] leading-tight text-ink-soft/60 max-w-[150px]
                            transition-colors duration-300 group-hover:text-ink-soft">
                {m.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
