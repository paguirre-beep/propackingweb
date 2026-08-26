import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink } from "../site";

const links = [
  { label: "Productos", href: "#productos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled || open ? "bg-white/80 backdrop-blur-xl border-b border-ink/8" : "bg-transparent"
    }`}>
      <nav className="container-px flex items-center justify-between h-20">
        <a href="#inicio" className="flex items-center gap-2.5 shrink-0">
          <Logo size={38} />
          <span className="font-display font-bold text-ink text-lg tracking-tight">ProPacking</span>
        </a>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[15px] text-ink-soft hover:text-ink transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-ink text-white px-5 py-2.5 text-sm font-medium hover:bg-navy transition-colors">
            Hablemos
          </a>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 text-ink" aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-ink/8 overflow-hidden">
            <ul className="container-px py-4 flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-base text-ink hover:text-navy">
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                  className="block text-center rounded-full bg-ink text-white px-5 py-3 text-sm font-medium">
                  Hablar por WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
