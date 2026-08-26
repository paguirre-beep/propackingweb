import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import Logo from "./Logo";
import { site, whatsappLink } from "../site";

const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Por qué elegirnos", href: "#por-que" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="container-px">
        <div className="grid md:grid-cols-[1.4fr_1fr_1.2fr] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-1.5"><Logo size={44} /></div>
              <span className="font-display font-bold text-xl">ProPacking</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Insumos para embalaje industrial, agrícola y general. Venta por mayor y menor, con la atención de una empresa familiar.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Navegación</h4>
            <ul className="space-y-2.5">
              {nav.map((l) => (
                <li key={l.href}><a href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                  <Phone size={16} className="text-brand-red shrink-0" />{site.telefonoVisible}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                  <Mail size={16} className="text-brand-red shrink-0" />{site.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin size={16} className="text-brand-red shrink-0" />{site.direccion}
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {site.redes.instagram && (
                <a href={site.redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Instagram size={18} /></a>
              )}
              {site.redes.facebook && (
                <a href={site.redes.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Facebook size={18} /></a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">© {year} ProPacking. Todos los derechos reservados.</p>
          <p className="text-xs text-white/40">Insumos para embalaje · Tucumán, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
