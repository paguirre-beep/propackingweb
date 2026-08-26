import { motion } from "framer-motion";
import WhatsappButton from "./WhatsappButton";

export default function CTA() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="container-px">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}
          className="rounded-3xl bg-surface-soft border border-ink/8 px-8 py-16 sm:py-20 text-center">
          <p className="text-xs font-bold tracking-widest text-brand-red uppercase mb-4">Estamos para ayudarte</p>
          <h2 className="font-display font-bold text-navy text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">
            ¿Necesitás asesoramiento?
          </h2>
          <p className="mt-5 text-lg text-ink-soft max-w-xl mx-auto">
            Nuestro equipo está listo para ayudarte a encontrar el producto ideal para tu negocio.
          </p>
          <div className="mt-9 flex justify-center">
            <WhatsappButton variant="green" className="text-base px-8 py-4">Hablar por WhatsApp</WhatsappButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
