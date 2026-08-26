import { motion } from "framer-motion";
import { ShieldCheck, Boxes, MessagesSquare, Truck } from "lucide-react";

const items = [
  { icon: ShieldCheck, t: "Calidad garantizada", d: "Trabajamos con productos de primera línea para que cada envío llegue perfecto." },
  { icon: Boxes, t: "Stock permanente", d: "Disponibilidad real y constante para que nunca frenes tu operación." },
  { icon: MessagesSquare, t: "Asesoramiento personalizado", d: "Te ayudamos a elegir el insumo ideal según tu producto y necesidad." },
  { icon: Truck, t: "Envíos a todo el país", d: "Logística ágil y segura para llegar a donde estés, en tiempo y forma." },
];

export default function PorQue() {
  return (
    <section id="por-que" className="py-24 bg-surface-soft">
      <div className="container-px">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold tracking-widest text-brand-red uppercase mb-3">La diferencia</p>
          <h2 className="font-display font-bold text-navy text-4xl sm:text-5xl">¿Por qué elegirnos?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div key={it.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl bg-white p-8 border border-ink/8 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-5">
                <it.icon size={28} strokeWidth={1.6} />
              </div>
              <h3 className="font-display font-semibold text-navy text-lg mb-2">{it.t}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{it.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
