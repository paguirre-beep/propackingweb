import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import {
  Home, Search, ClipboardList, User, ChevronLeft, ChevronRight,
  Plus, Minus, X, SlidersHorizontal, Share2, Check, ShoppingCart,
  Clock, ShieldCheck, FileText, MessageCircle, ArrowRight, Copy,
  Download, Package, Clock4,
  Lock, Tag, Inbox, TrendingUp, Phone, Mail, LogOut, Settings, ChevronDown,
  Loader2,
} from "lucide-react";
import { cargarCatalogo, guardarSolicitud, cargarProveedores, ajustarPreciosProveedor, iniciarSesion, cerrarSesion, cargarSolicitudes, cambiarEstadoSolicitud } from "./lib/data";

/* ============================ THEME ============================
   Sistema visual premium B2B. Azul corporativo profundo + marfil
   cálido + grises elegantes. Aire, jerarquía fuerte, precio
   protagonista. La LÓGICA (tapas, unidad, volumen) no cambia. */
const NAVY = "#122A4F";       // azul corporativo profundo
const NAVY_2 = "#1C3A63";     // hover / gradiente
const ACCENT = "#C6A15B";     // dorado sobrio (detalle cálido mínimo)
const IVORY = "#FBF9F4";      // marfil cálido de fondo
const PAPER = "#FFFFFF";
const INK = "#16202E";        // texto fuerte
const SUB = "#5A6676";        // texto secundario
const FAINT = "#98A1AE";      // terciario
const LINE = "#ECE8DF";       // líneas cálidas suaves
const LINE_COOL = "#E8ECF2";  // líneas frías (sobre blanco)
const OK = "#3F9D5B";
const NAVY_WASH = "#F0F3F8";

const money = (n) =>
  "$ " + (Number(n) || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ============================ DATA (mock) ============================ */
const CATS = [
  { slug: "frascos", label: "Frascos", img: "https://spgsypudsrkslvslsdpq.supabase.co/storage/v1/object/public/productos/amanecer360.jpg" },
  { slug: "botellas", label: "Botellas", img: "https://spgsypudsrkslvslsdpq.supabase.co/storage/v1/object/public/productos/jugo910.jpg" },
  { slug: "medicinal-cosmetica", label: "Medicinal / Cosmética", img: "https://spgsypudsrkslvslsdpq.supabase.co/storage/v1/object/public/productos/hexagonal190.jpg" },
];

const TAPAS = ["Todos", "Sin tapa", "Tapa Dorada", "Tapa Blanca", "Tapa Negra", "Tapa Roja"];
const TAPAS_SEL = ["Sin tapa", "Tapa Dorada", "Tapa Blanca", "Tapa Negra", "Tapa Roja"];

/* Escala de volumen (umbrales por cantidad total de unidades). */
const VOLUMEN = [
  { desde: 1, hasta: 19, desc: 0, etiqueta: "Por unidad" },
  { desde: 20, hasta: 99, desc: 0.15, etiqueta: "Desde 20 u." },
  { desde: 100, hasta: Infinity, desc: 0.235, etiqueta: "Desde 100 u." },
];
const descPorCantidad = (cant) =>
  VOLUMEN.find((t) => cant >= t.desde && cant <= t.hasta) || VOLUMEN[0];

// El catálogo ahora se carga desde Supabase (ver CatalogoProvider más abajo).
// Este contexto lo expone a todas las pantallas.
const CatalogoCtx = createContext({ productos: [], cargando: true, error: null });
const useCatalogo = () => useContext(CatalogoCtx);

const tapasDe = (p) => TAPAS_SEL.filter((t) => p.precios[t] != null);
const precioDesde = (p) => {
  const vals = Object.values(p.precios || {});
  return vals.length ? Math.min(...vals) : 0;
};
const IVA_RATE = 0.21;

// pedidos con mas de 200 u. POR PRODUCTO requieren 24hs de antelacion
const UMBRAL_24HS = 200;
const requiere24hs = (items) => items.some((i) => i.cant > UMBRAL_24HS);

/* ---- Datos de ejemplo para el PANEL DE ADMIN ---- */
const PROVEEDORES = [
  { id: "vid", nombre: "Vidriería del Norte", tipo: "Vidrio (frascos y botellas)" },
  { id: "met", nombre: "Tapas Metálicas SA", tipo: "Tapas metálicas (dorada/negra)" },
  { id: "pla", nombre: "Plásticos Cuyo", tipo: "Tapas plásticas (blanca)" },
];

const PEDIDOS_MOCK = [
  { num: "PED-000198", tipo: "pedido", estado: "pendiente", fecha: "Hoy · 10:24 hs",
    cliente: "Juan Pérez", empresa: "Conservas del Valle", tel: "381 555 1234", email: "juan@conservasdelvalle.com",
    items: [{ n: "Frasco Amanecer 360 cc", tapa: "Dorada", cant: 240, sub: 40010 }, { n: "Frasco 250 cc", tapa: "Blanca", cant: 60, sub: 7650 }],
    total: 57739.60, requiere24: true },
  { num: "PED-000197", tipo: "pedido", estado: "en_proceso", fecha: "Hoy · 09:02 hs",
    cliente: "María López", empresa: "Dulces Caseros ML", tel: "381 555 8899", email: "maria.lopez@gmail.com",
    items: [{ n: "Frasco 190 cc", tapa: "Dorada", cant: 100, sub: 10285 }],
    total: 12444.85, requiere24: false },
  { num: "COT-000234", tipo: "cotizacion", estado: "pendiente", fecha: "Ayer · 17:41 hs",
    cliente: "Carlos Díaz", empresa: "", tel: "381 555 4477", email: "carlosd@outlook.com",
    items: [{ n: "Botella Aceite 250 cc", tapa: "Negra", cant: 48, sub: 9120 }],
    total: 11035.20, requiere24: false },
  { num: "PED-000196", tipo: "pedido", estado: "cerrada", fecha: "Ayer · 11:15 hs",
    cliente: "Lucía Fernández", empresa: "Almacén Central", tel: "381 555 2211", email: "lucia@almacencentral.com.ar",
    items: [{ n: "Frasco Amanecer 720 cc", tapa: "Dorada", cant: 300, sub: 76194 }],
    total: 92194.74, requiere24: true },
];

const ESTADOS = {
  pendiente: { label: "Pendiente", color: "#8A5A00", bg: "#FBF1DD" },
  en_proceso: { label: "En proceso", color: "#1C4B8A", bg: "#E4EEFB" },
  cerrada: { label: "Cerrada", color: "#2C7A45", bg: "#E1F3E7" },
  perdida: { label: "Perdida", color: "#8A2C2C", bg: "#FBE4E4" },
};

/* ============================ PREMIUM JAR ILLUSTRATION ============================
   Frasco con más realismo: reflejos, sombra de apoyo, tapa con brillo.
   Placeholder elegante hasta tener fotos reales. */
function Jar({ size = 64, tapa = "Tapa Dorada", pedestal = false }) {
  const sinTapa = tapa === "Sin tapa";
  const capTop = tapa === "Tapa Negra" ? "#3A3A3D" : tapa === "Tapa Blanca" ? "#F4F4F2" : tapa === "Tapa Roja" ? "#C24444" : "#D8B45E";
  const capBot = tapa === "Tapa Negra" ? "#232326" : tapa === "Tapa Blanca" ? "#DCDCD8" : tapa === "Tapa Roja" ? "#9E3232" : "#B8923E";
  const uid = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9F1F6" />
          <stop offset="0.42" stopColor="#CFE2EC" />
          <stop offset="0.5" stopColor="#F4FAFD" />
          <stop offset="0.58" stopColor="#CFE2EC" />
          <stop offset="1" stopColor="#BCD3DF" />
        </linearGradient>
        <linearGradient id={`c-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={capTop} />
          <stop offset="1" stopColor={capBot} />
        </linearGradient>
      </defs>
      {pedestal && <ellipse cx="40" cy="72" rx="20" ry="4" fill="#000" opacity="0.06" />}
      {!sinTapa && <rect x="25" y="8" width="30" height="11" rx="3" fill={`url(#c-${uid})`} />}
      {!sinTapa && <rect x="27" y="10" width="9" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />}
      {sinTapa && <path d="M23 22 h34" stroke="#AEC7D6" strokeWidth="1.6" fill="none" strokeLinecap="round" />}
      <path d="M23 22 h34 a4 4 0 0 1 4 4 v38 a6 6 0 0 1 -6 6 h-30 a6 6 0 0 1 -6 -6 v-38 a4 4 0 0 1 4 -4 z"
        fill={`url(#g-${uid})`} stroke="#A9C4D3" strokeWidth="1.2" />
      <rect x="28" y="32" width="6" height="26" rx="3" fill="#ffffff" opacity="0.55" />
      <rect x="38" y="34" width="3" height="20" rx="1.5" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

/* ============================ CART CONTEXT ============================ */
const CartCtx = createContext(null);
const useCart = () => useContext(CartCtx);

/* Muestra la foto real del producto si existe (imagenUrl),
   con fallback al dibujo Jar si no hay foto o si falla la carga. */
function ProductImage({ producto, size = 64, tapa = "Tapa Dorada", pedestal = false }) {
  const [error, setError] = React.useState(false);
  const url = producto?.imagenUrl;
  if (!url || error) {
    return <Jar size={size} tapa={tapa} pedestal={pedestal} />;
  }
  return (
    <img
      src={url}
      alt={producto?.nombre || "Producto"}
      onError={() => setError(true)}
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}

function proximoCorte(cant) {
  if (cant < 20) return { faltan: 20 - cant, desc: "15%" };
  if (cant < 100) return { faltan: 100 - cant, desc: "10% adicional" };
  return null;
}
function calcLinea(precioBase, cant) {
  const tramo = descPorCantidad(cant);
  const unit = precioBase * (1 - tramo.desc);
  return { unit, total: unit * cant, desc: tramo.desc, etiqueta: tramo.etiqueta };
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const add = (prod, tapa, cant = 1) => {
    const key = prod.id + "-" + tapa;
    const precioBase = prod.precios[tapa];
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, cant: i.cant + cant } : i));
      return [...prev, { key, prodId: prod.id, nombre: prod.nombre, tapa, precioBase, cant }];
    });
  };
  const setCant = (key, cant) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, cant: Math.max(1, cant) } : i)));
  const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);
  const [ultimoNumero, setUltimoNumero] = useState(null);
  const count = items.reduce((a, i) => a + i.cant, 0);
  const lineas = items.length;
  const subtotal = items.reduce((a, i) => a + calcLinea(i.precioBase, i.cant).total, 0);
  const subtotalLista = items.reduce((a, i) => a + i.precioBase * i.cant, 0);
  const descuento = subtotalLista - subtotal;
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;
  return (
    <CartCtx.Provider value={{ items, add, setCant, remove, clear, count, lineas, subtotal, subtotalLista, descuento, iva, total, ultimoNumero, setUltimoNumero }}>
      {children}
    </CartCtx.Provider>
  );
}

/* ============================ SHARED UI ============================ */
function Stepper({ value, onChange, small }) {
  const s = small ? 30 : 40;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, background: PAPER,
      border: `1px solid ${LINE_COOL}`, borderRadius: 12, padding: 3 }}>
      <button onClick={() => onChange(value - 1)} style={stepBtn(s)} aria-label="Restar"><Minus size={small ? 15 : 17} /></button>
      <span style={{ minWidth: small ? 30 : 40, textAlign: "center", fontWeight: 700, fontSize: small ? 15 : 17, color: INK }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={stepBtn(s, true)} aria-label="Sumar"><Plus size={small ? 15 : 17} /></button>
    </div>
  );
}
const stepBtn = (s, filled) => ({
  width: s, height: s, borderRadius: 9, border: "none",
  background: filled ? NAVY : "transparent", color: filled ? "#fff" : NAVY,
  display: "grid", placeItems: "center", cursor: "pointer",
});

function TabBar({ tab, go }) {
  const { count } = useCart();
  const items = [
    { id: "home", label: "Inicio", Icon: Home },
    { id: "list", label: "Productos", Icon: Search },
    { id: "budget", label: "Presupuesto", Icon: ClipboardList, badge: count },
    { id: "account", label: "Cuenta", Icon: User },
  ];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${LINE}`, background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(8px)", paddingBottom: 4 }}>
      {items.map(({ id, label, Icon, badge }) => {
        const active = tab === id || (id === "list" && tab === "detail");
        return (
          <button key={id} onClick={() => go(id)}
            style={{ flex: 1, padding: "12px 0 10px", background: "none", border: "none", cursor: "pointer",
              color: active ? NAVY : FAINT, display: "grid", placeItems: "center", gap: 4, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.9} />
              {badge > 0 && (
                <span style={{ position: "absolute", top: -7, right: -11, background: ACCENT, color: NAVY,
                  fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "1px 5px", minWidth: 8, textAlign: "center" }}>{badge}</span>
              )}
            </div>
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, letterSpacing: 0.2 }}>{label}</span>
            {active && <span style={{ position: "absolute", top: 0, width: 26, height: 3, borderRadius: 3, background: NAVY }} />}
          </button>
        );
      })}
    </div>
  );
}

function BudgetBar({ go }) {
  const { count, total } = useCart();
  const empty = count === 0;
  return (
    <div style={{ padding: "0 20px", marginTop: 8 }}>
      <button onClick={() => go("budget")}
        style={{ width: "100%", padding: "16px 18px", borderRadius: 20, cursor: "pointer", border: "none",
          background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 100%)`, color: "#fff",
          display: "flex", alignItems: "center", gap: 14, boxShadow: "0 10px 24px -12px rgba(18,42,79,0.55)" }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <ClipboardList size={20} />
        </div>
        <div style={{ textAlign: "left", flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.92 }}>
            {empty ? "Tu presupuesto está vacío" : `${count} ${count === 1 ? "unidad" : "unidades"} en tu presupuesto`}
          </div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1 }}>Total estimado</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.3 }}>{money(total)}</div>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,0.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}

/* ============================ SCREENS ============================ */
function HomeScreen({ go, openProduct }) {
  const { productos } = useCatalogo();
  const destacados = productos.filter((p) => p.destacado);
  return (
    <Screen>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <div style={avatarBtn}><User size={19} color={NAVY} /></div>
        </div>

        <h1 style={{ fontSize: 30, lineHeight: 1.1, margin: "26px 0 10px", color: INK, fontWeight: 800, letterSpacing: -0.7 }}>
          Cotizá tus<br />envases de vidrio
        </h1>
        <p style={{ color: SUB, fontSize: 14.5, margin: "0 0 18px", lineHeight: 1.5, maxWidth: 300 }}>
          Elegí tus productos, agregá cantidades y recibí tu presupuesto al instante.
        </p>
        <SearchBox onFocus={() => go("list")} placeholder="Buscar envases..." />
      </div>

      <Section title="Categorías">
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "2px 20px 4px" }}>
          {CATS.map((c) => (
            <button key={c.slug} onClick={() => go("list")} style={catTile}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: IVORY, display: "grid", placeItems: "center", marginBottom: 8, overflow: "hidden" }}>
                {c.img ? (
                  <img src={c.img} alt={c.label} style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
                ) : (
                  <Jar size={44} />
                )}
              </div>
              <span style={{ fontSize: 12.5, color: INK, fontWeight: 600 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Productos destacados" action="Ver todos" onAction={() => go("list")}>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 20px 8px" }}>
          {destacados.map((p) => (
            <div key={p.id} style={featCard} onClick={() => openProduct(p)}>
              <div style={{ height: 118, borderRadius: 16, background: IVORY, display: "grid", placeItems: "center", marginBottom: 12, position: "relative" }}>
                <ProductImage producto={p} size={82} tapa={tapasDe(p)[0]} pedestal />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: INK, lineHeight: 1.25, letterSpacing: -0.2 }}>{p.nombre}</div>
              <div style={{ fontSize: 11.5, color: FAINT, marginTop: 3 }}>Cod. {p.cod}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: FAINT, marginBottom: -1 }}>desde</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: NAVY, letterSpacing: -0.4 }}>{money(precioDesde(p))}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); openProduct(p); }} style={featPlus}><Plus size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <BudgetBar go={go} />
      <Trust />
      <div style={{ height: 12 }} />
    </Screen>
  );
}

function ListScreen({ go, openProduct }) {
  const { add } = useCart();
  const { productos } = useCatalogo();
  const [q, setQ] = useState("");
  const [tapa, setTapa] = useState("Todos");

  const results = useMemo(() => productos.filter((p) => {
    const okTapa = tapa === "Todos" || tapasDe(p).includes(tapa);
    const okQ = !q || (p.nombre + p.cod).toLowerCase().includes(q.toLowerCase());
    return okTapa && okQ;
  }), [q, tapa, productos]);

  return (
    <Screen>
      <div style={{ padding: "20px 20px 0", position: "sticky", top: 0, background: IVORY, zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => go("home")} style={iconBtn}><ChevronLeft size={20} color={NAVY} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 21, fontWeight: 800, color: INK, letterSpacing: -0.4 }}>Frascos</div>
            <div style={{ fontSize: 12.5, color: FAINT }}>{results.length} productos disponibles</div>
          </div>
          <button style={iconBtn}><SlidersHorizontal size={18} color={NAVY} /></button>
        </div>
        <div style={{ marginTop: 14 }}><SearchBox value={q} onChange={setQ} placeholder="Buscar frascos..." /></div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "14px 0 12px", margin: "0 -20px", paddingLeft: 20, paddingRight: 20 }}>
          {TAPAS.map((t) => (
            <button key={t} onClick={() => setTapa(t)} style={chip(tapa === t)}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "4px 20px 8px" }}>
        {results.map((p) => (
          <div key={p.id} style={rowCard} onClick={() => openProduct(p)}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: IVORY, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <ProductImage producto={p} size={56} tapa={tapasDe(p)[0]} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK, letterSpacing: -0.2 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{tapasDe(p).map((t) => t.replace("Tapa ", "")).join(" · ")}</div>
              <div style={{ fontSize: 11, color: FAINT, marginTop: 1 }}>Cod. {p.cod}</div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 10.5, color: FAINT }}>desde</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: NAVY, letterSpacing: -0.4 }}>{money(precioDesde(p))}</span>
                <span style={{ fontSize: 11, color: FAINT }}>/ unidad</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); add(p, tapasDe(p)[0], 1); }} style={addBtn} aria-label="Agregar">
              <Plus size={20} />
            </button>
          </div>
        ))}
      </div>
      <BudgetBar go={go} />
      <div style={{ height: 8 }} />
    </Screen>
  );
}

function DetailScreen({ product, go }) {
  const { add } = useCart();
  const tapas = tapasDe(product);
  const [tapa, setTapa] = useState(tapas[0]);
  const [cant, setCant] = useState(1);
  const cantSegura = cant === "" || cant < 1 ? 1 : cant; // para cálculos y agregar
  const linea = calcLinea(product.precios[tapa], cantSegura);

  const tramos = [
    { t: "1 – 19", d: "Lista", on: cantSegura < 20 },
    { t: "20+", d: "−15%", on: cantSegura >= 20 && cantSegura < 100 },
    { t: "100+", d: "−15% +10%", on: cantSegura >= 100 },
  ];

  return (
    <Screen>
      {/* Hero foto protagonista */}
      <div style={{ position: "relative", background: `linear-gradient(180deg, ${IVORY} 0%, #F3EFE6 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", position: "absolute", width: "100%", boxSizing: "border-box", zIndex: 2 }}>
          <button onClick={() => go("list")} style={roundBtn}><ChevronLeft size={20} color={NAVY} /></button>
          <button style={roundBtn}><Share2 size={17} color={NAVY} /></button>
        </div>
        <div style={{ height: 300, display: "grid", placeItems: "center" }}><ProductImage producto={product} size={210} tapa={tapa} pedestal /></div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", paddingBottom: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 6, background: i === 0 ? NAVY : "#CBD3DD", transition: "all .2s" }} />
          ))}
        </div>
      </div>

      {/* Cuerpo en tarjeta que sube sobre el hero */}
      <div style={{ background: IVORY, borderRadius: "26px 26px 0 0", marginTop: -20, position: "relative", padding: "24px 20px 0" }}>
        <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: NAVY, background: NAVY_WASH, padding: "4px 10px", borderRadius: 20, letterSpacing: 0.3 }}>
          Cod. {product.cod}
        </div>
        <h2 style={{ margin: "12px 0 0", fontSize: 25, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>{product.nombre}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: OK, fontSize: 13, fontWeight: 600, marginTop: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 7, background: OK }} /> En stock
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "22px 0 10px" }}>Elegí la tapa</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tapas.map((t) => (
            <button key={t} onClick={() => setTapa(t)} style={tapaPill(tapa === t)}>
              <span style={{ width: 12, height: 12, borderRadius: 12, background: tapaSwatch(t), border: t === "Sin tapa" ? `1px dashed ${FAINT}` : "1px solid #0002", display: "inline-block" }} />
              {t.replace("Tapa ", "")}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "22px 0 10px" }}>Cantidad</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Stepper value={cant === "" ? 1 : cant} onChange={(v) => setCant(Math.max(1, v))} />
          <input type="number" value={cant} min={1} inputMode="numeric"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") { setCant(""); return; }
              setCant(Math.max(1, parseInt(v) || 1));
            }}
            onFocus={(e) => e.target.select()}
            onBlur={() => { if (cant === "" || cant < 1) setCant(1); }}
            style={{ width: 76, border: `1px solid ${LINE_COOL}`, borderRadius: 12, padding: "11px 12px", fontSize: 15, textAlign: "center", outline: "none", background: PAPER, color: INK, fontWeight: 600 }} />
          <span style={{ fontSize: 13, color: FAINT }}>unidades</span>
        </div>

        {/* Escala de descuento por volumen */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {tramos.map((x, k) => (
            <div key={k} style={{ flex: 1, textAlign: "center", padding: "11px 6px", borderRadius: 14,
              border: `1.5px solid ${x.on ? NAVY : LINE}`, background: x.on ? NAVY : PAPER, transition: "all .18s" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: x.on ? "#fff" : INK }}>{x.t}</div>
              <div style={{ fontSize: 10, color: x.on ? "rgba(255,255,255,0.8)" : FAINT, marginTop: 2, fontWeight: 600 }}>{x.d}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: FAINT, marginTop: 8, textAlign: "center" }}>Cuanto más comprás, menor es el precio por unidad.</div>
      </div>

      {/* Barra de precio + CTA fija abajo */}
      <div style={{ background: IVORY, padding: "16px 20px 18px", marginTop: 8, borderTop: `1px solid ${LINE}` }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11.5, color: FAINT }}>Precio por unidad</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, letterSpacing: -0.8, lineHeight: 1.1 }}>{money(linea.unit)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11.5, color: FAINT }}>Subtotal · {cantSegura} u.</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: INK, letterSpacing: -0.4 }}>{money(linea.total)}</div>
          </div>
        </div>
        <button onClick={() => { add(product, tapa, cantSegura); go("budget"); }} style={primaryBtn}>
          <ShoppingCart size={19} /> Agregar al presupuesto
        </button>
      </div>
    </Screen>
  );
}

function BudgetScreen({ go, startFlow }) {
  const { items, setCant, remove, subtotal, subtotalLista, descuento, iva, total, count } = useCart();
  const [tab, setTab] = useState("activo");
  const aviso24 = requiere24hs(items);

  return (
    <Screen>
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>Tu presupuesto</h2>
        <p style={{ fontSize: 13.5, color: SUB, margin: "4px 0 0" }}>Revisá tu pedido antes de enviarlo.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[["activo", `Activo (${count})`], ["enviados", "Enviados"], ["historial", "Historial"]].map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} style={segTab(tab === id)}>{l}</button>
          ))}
        </div>
      </div>

      {tab !== "activo" ? (
        <EmptyState icon={FileText} title="Nada por acá todavía"
          text={tab === "enviados" ? "Tus cotizaciones enviadas van a aparecer acá." : "Tu historial de cotizaciones va a aparecer acá."} />
      ) : items.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Tu presupuesto está vacío"
          text="Explorá el catálogo y sumá productos para armar tu cotización."
          cta="Ver productos" onCta={() => go("list")} />
      ) : (
        <>
          <div style={{ padding: "16px 20px 4px" }}>
            {items.map((i) => {
              const l = calcLinea(i.precioBase, i.cant);
              const corte = proximoCorte(i.cant);
              return (
                <div key={i.key} style={budgetCard}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: IVORY, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Jar size={48} tapa={i.tapa} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: INK, letterSpacing: -0.2 }}>{i.nombre}</div>
                        <button onClick={() => remove(i.key)} style={{ background: "none", border: "none", cursor: "pointer", color: FAINT, padding: 0, marginTop: 1 }}><X size={17} /></button>
                      </div>
                      <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>{i.tapa.replace("Tapa ", "")} · {money(l.unit)} c/u</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                        <Stepper small value={i.cant} onChange={(v) => setCant(i.key, v)} />
                        <div style={{ fontWeight: 800, color: INK, fontSize: 16, letterSpacing: -0.3 }}>{money(l.total)}</div>
                      </div>
                    </div>
                  </div>
                  {corte && (
                    <div style={{ marginTop: 12, fontSize: 12, color: NAVY, background: NAVY_WASH, borderRadius: 11, padding: "9px 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
                      <ArrowRight size={14} /> Sumá {corte.faltan} u. más y bajás un {corte.desc}
                    </div>
                  )}
                  {i.cant > UMBRAL_24HS && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#8A5A00", background: "#FBF1DD", borderRadius: 11, padding: "9px 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
                      <Clock4 size={14} /> Más de 200 u.: se prepara con 24 hs de anticipación.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "0 20px 4px" }}>
            <button onClick={() => go("list")}
              style={{ width: "100%", background: PAPER, color: NAVY, border: `1.5px dashed ${NAVY}`, borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus size={18} /> Seguí agregando productos
            </button>
          </div>

          <div style={{ padding: "12px 20px 0" }}>
            <div style={{ background: PAPER, borderRadius: 20, border: `1px solid ${LINE_COOL}`, padding: "18px 18px" }}>
              {descuento > 0 ? (
                <>
                  <Line label="Subtotal (precio lista)" value={money(subtotalLista)} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0" }}>
                    <span style={{ fontSize: 13.5, color: "#2E9E5B", fontWeight: 600 }}>Descuento por volumen</span>
                    <span style={{ fontSize: 13.5, color: "#2E9E5B", fontWeight: 700 }}>− {money(descuento)}</span>
                  </div>
                  <Line label="Subtotal con descuento" value={money(subtotal)} />
                </>
              ) : (
                <Line label="Subtotal" value={money(subtotal)} />
              )}
              <Line label="IVA (21%)" value={money(iva)} />
              <div style={{ height: 1, background: LINE_COOL, margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, color: INK, fontSize: 15 }}>Total estimado</span>
                <span style={{ fontWeight: 800, fontSize: 24, color: NAVY, letterSpacing: -0.6 }}>{money(total)}</span>
              </div>
            </div>
          </div>

          {aviso24 && (
            <div style={{ margin: "12px 20px 0", background: "#FBF1DD", border: "1px solid #EFD9A8", borderRadius: 16, padding: "13px 15px", display: "flex", gap: 11 }}>
              <Clock4 size={19} color="#8A5A00" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#7A4F00" }}>Pedido con preparación</div>
                <div style={{ fontSize: 12, color: "#8A5A00", lineHeight: 1.45, marginTop: 2 }}>
                  Tenés productos con más de 200 unidades. Esos pedidos se preparan con 24 hs de anticipación.
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: "16px 20px 8px" }}>
            <button onClick={() => startFlow("pedido")} style={primaryBtn}>
              <Package size={19} /> Solicitar pedido
            </button>
            <button onClick={() => startFlow("cotizacion")} style={{ ...ghostBtn, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Download size={18} /> Descargar cotización
            </button>
            <p style={{ textAlign: "center", fontSize: 11.5, color: FAINT, marginTop: 12, lineHeight: 1.5 }}>
              El total es estimado. Confirmamos el precio final al procesar tu solicitud.
            </p>
          </div>
        </>
      )}
    </Screen>
  );
}

function FormScreen({ go, modo }) {
  const cart = useCart();
  const [f, setF] = useState({ nombre: "", empresa: "", tel: "", email: "" });
  const [bajando, setBajando] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.nombre.trim() && f.email.includes("@") && f.tel.trim();
  const esCotizacion = modo === "cotizacion";

  const [errorMsg, setErrorMsg] = useState("");

  const onContinuar = async () => {
    setBajando(true);
    setErrorMsg("");
    try {
      // Guarda la solicitud en Supabase (cotización o pedido) y obtiene el número real
      const numero = await guardarSolicitud({
        tipo: modo,
        datos: f,
        items: cart.items,
        subtotal: cart.subtotal,
        iva: cart.iva,
        total: cart.total,
        requiere24: cart.items.some((i) => i.cant > UMBRAL_24HS),
      });
      // Si es cotización, además genera y descarga el PDF
      if (esCotizacion) {
        await generarPDF(f, cart, numero);
      }
      cart.setUltimoNumero(numero);
      go("done");
    } catch (err) {
      console.error(err);
      setErrorMsg("No pudimos procesar tu solicitud. Revisá tu conexión e intentá de nuevo.");
    } finally {
      setBajando(false);
    }
  };

  return (
    <Screen>
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => go("budget")} style={iconBtn}><ChevronLeft size={20} color={NAVY} /></button>
        <div>
          <div style={{ fontSize: 21, fontWeight: 800, color: INK, letterSpacing: -0.4 }}>
            {esCotizacion ? "Descargar cotización" : "Solicitar pedido"}
          </div>
          <div style={{ fontSize: 12.5, color: FAINT }}>Completá tus datos de contacto</div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ background: NAVY_WASH, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: PAPER, display: "grid", placeItems: "center", flexShrink: 0 }}>
            {esCotizacion ? <Download size={19} color={NAVY} /> : <Package size={19} color={NAVY} />}
          </div>
          <div style={{ fontSize: 12.5, color: SUB, lineHeight: 1.45 }}>
            {esCotizacion
              ? "Descargás tu cotización en PDF y te la enviamos también por email."
              : "Tu pedido queda registrado y te contactamos para coordinar la entrega."}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: INK, margin: "0 0 16px", letterSpacing: -0.2 }}>Datos de contacto</div>
        <Field label="Nombre y apellido" value={f.nombre} onChange={set("nombre")} placeholder="Ej: Juan Pérez" />
        <Field label="Empresa (opcional)" value={f.empresa} onChange={set("empresa")} placeholder="Nombre de tu empresa" />
        <Field label="Teléfono" value={f.tel} onChange={set("tel")} placeholder="381 123 4567" />
        <Field label="Email" value={f.email} onChange={set("email")} placeholder="tucorreo@empresa.com" />
        <p style={{ fontSize: 12, color: FAINT, marginTop: 2, lineHeight: 1.5 }}>Usamos estos datos solo para contactarte por tu solicitud. Tu información está protegida.</p>
      </div>

      {errorMsg && (
        <div style={{ margin: "0 20px", background: "#FBE4E4", border: "1px solid #F0BFBF", borderRadius: 13, padding: "12px 14px", fontSize: 12.5, color: "#8A2C2C", fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      <div style={{ padding: "12px 20px 8px" }}>
        <button disabled={!valid || bajando} onClick={onContinuar}
          style={{ ...primaryBtn, opacity: (valid && !bajando) ? 1 : 0.4, cursor: (valid && !bajando) ? "pointer" : "not-allowed" }}>
          {bajando ? <><Loader2 size={18} className="spin" /> Procesando...</> : esCotizacion ? <>Descargar cotización <Download size={18} /></> : <>Confirmar pedido <ArrowRight size={18} /></>}
        </button>
      </div>
    </Screen>
  );
}

/* Genera y descarga un PDF simple de la cotizacion (version prototipo).
   En la app final saldra con branding y numeracion real. */
async function generarPDF(datos, cart, numero) {
  // carga jsPDF desde CDN una sola vez
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s.onload = res; s.onerror = rej;
      document.body.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const num = numero || "COT-000000";
  const fecha = new Date().toLocaleDateString("es-AR") + " " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  doc.setFillColor(18, 42, 79);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  doc.text("PROPACKING VIDRIO", 14, 16);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Cotizacion de envases de vidrio", 14, 23);

  doc.setTextColor(30, 30, 30); doc.setFontSize(11);
  doc.text(`Cotizacion N: ${num}`, 14, 44);
  doc.text(`Fecha: ${fecha}`, 14, 51);
  doc.text(`Cliente: ${datos.nombre}${datos.empresa ? " - " + datos.empresa : ""}`, 14, 58);
  doc.text(`Contacto: ${datos.tel}  |  ${datos.email}`, 14, 65);

  // tabla
  let y = 80;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.setFillColor(240, 243, 248); doc.rect(14, y - 6, 182, 9, "F");
  doc.text("Producto", 16, y); doc.text("Tapa", 96, y); doc.text("Cant.", 126, y);
  doc.text("P. unit.", 146, y); doc.text("Subtotal", 172, y);
  y += 8; doc.setFont("helvetica", "normal");

  cart.items.forEach((i) => {
    const l = calcLinea(i.precioBase, i.cant);
    doc.text(String(i.nombre).slice(0, 34), 16, y);
    doc.text(i.tapa.replace("Tapa ", ""), 96, y);
    doc.text(String(i.cant), 126, y);
    doc.text(money(l.unit).replace("$ ", "$"), 146, y);
    doc.text(money(l.total).replace("$ ", "$"), 172, y);
    y += 7;
    if (i.cant > UMBRAL_24HS) {
      doc.setTextColor(138, 90, 0); doc.setFontSize(8);
      doc.text("  * Mas de 200 u.: se prepara con 24 hs de anticipacion.", 16, y);
      doc.setTextColor(30, 30, 30); doc.setFontSize(10); y += 6;
    }
  });

  y += 4; doc.setDrawColor(220, 220, 220); doc.line(120, y, 196, y); y += 8;
  doc.text("Subtotal:", 140, y); doc.text(money(cart.subtotal).replace("$ ", "$"), 172, y); y += 7;
  doc.text("IVA (21%):", 140, y); doc.text(money(cart.iva).replace("$ ", "$"), 172, y); y += 7;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12);
  doc.text("TOTAL:", 140, y); doc.text(money(cart.total).replace("$ ", "$"), 172, y);

  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 120, 120);
  doc.text("Precios estimados sujetos a confirmacion. Cotizacion valida por 7 dias.", 14, 285);

  doc.save(`Cotizacion-${num}.pdf`);
}

function DoneScreen({ go, modo }) {
  const { total, items, clear, ultimoNumero } = useCart();
  const esCotizacion = modo === "cotizacion";
  const num = ultimoNumero || (esCotizacion ? "COT-000000" : "PED-000000");
  const hay24 = requiere24hs(items);
  const fecha = new Date().toLocaleDateString("es-AR") + " · " +
    new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) + " hs";

  const pasos = esCotizacion
    ? [["Descargaste tu cotización", "El PDF se guardó en tu teléfono."],
       ["Te la enviamos por email", "Con el detalle y el total estimado."],
       ["Cuando quieras, pedí", "Volvé y convertí tu cotización en pedido."]]
    : [["Recibimos tu pedido", "Validamos productos y cantidades."],
       ["Preparamos todo", hay24 ? "Los productos de +200 u. llevan 24 hs." : "Coordinamos la entrega con vos."],
       ["Te contactamos", "Por email y WhatsApp para cerrar el pedido."]];

  return (
    <Screen>
      <div style={{ padding: "56px 24px 0", textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: 88, margin: "0 auto", position: "relative",
          background: "#E4F3E8", display: "grid", placeItems: "center" }}>
          <div style={{ position: "absolute", inset: -8, borderRadius: 100, border: "1.5px solid #CBE7D3" }} />
          <Check size={44} color={OK} strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: 25, fontWeight: 800, color: INK, margin: "24px 0 10px", letterSpacing: -0.5 }}>
          {esCotizacion ? "¡Cotización lista!" : "¡Pedido solicitado!"}
        </h2>
        <p style={{ color: SUB, fontSize: 14.5, lineHeight: 1.55, margin: "0 auto", maxWidth: 296 }}>
          {esCotizacion
            ? "Descargamos tu cotización en PDF y te la enviamos también por email."
            : "Recibimos tu pedido correctamente. Te contactamos a la brevedad para coordinar la entrega."}
        </p>
      </div>

      <div style={{ margin: "28px 20px 0", padding: "4px", borderRadius: 22, background: `linear-gradient(135deg, ${NAVY}, ${NAVY_2})` }}>
        <div style={{ padding: "20px", borderRadius: 19 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>{esCotizacion ? "Número de cotización" : "Número de pedido"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginTop: 2, letterSpacing: 0.5 }}>#{num}</div>
            </div>
            <button style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.12)", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Copy size={17} color="#fff" />
            </button>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>Fecha</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", marginTop: 2 }}>{fecha}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)" }}>Total estimado</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT, marginTop: 2 }}>{money(total)}</div>
            </div>
          </div>
        </div>
      </div>

      {hay24 && !esCotizacion && (
        <div style={{ margin: "14px 20px 0", background: "#FBF1DD", border: "1px solid #EFD9A8", borderRadius: 16, padding: "12px 15px", display: "flex", gap: 10, alignItems: "center" }}>
          <Clock4 size={18} color="#8A5A00" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#8A5A00", lineHeight: 1.45 }}>
            Tu pedido incluye productos de más de 200 unidades: se preparan con 24 hs de anticipación.
          </div>
        </div>
      )}

      <div style={{ margin: "20px 20px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: FAINT, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>Próximos pasos</div>
        {pasos.map(([t, d], i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 26, background: NAVY_WASH, color: NAVY, fontWeight: 800, fontSize: 12, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>{t}</div>
              <div style={{ fontSize: 12, color: SUB, lineHeight: 1.4 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 20px 16px" }}>
        {esCotizacion && (
          <button onClick={() => go("budget")} style={{ ...primaryBtn, marginBottom: 10 }}>
            <Package size={18} /> Convertir en pedido
          </button>
        )}
        <button style={{ ...(esCotizacion ? ghostBtn : primaryBtn), background: esCotizacion ? undefined : "#1FA855", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <MessageCircle size={18} /> Enviar por WhatsApp
        </button>
        <button onClick={() => { clear(); go("home"); }} style={ghostBtn}>Volver al inicio</button>
      </div>
    </Screen>
  );
}

/* ============================ ADMIN PANEL ============================
   Prototipo visual. Login simulado, edición de precios + ajuste por
   proveedor, y bandeja de pedidos. En la app real: Supabase Auth +
   lectura/escritura de verdad. */

function AdminLogin({ onLogin, onExit }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(null);
  const [entrando, setEntrando] = useState(false);

  const ingresar = async () => {
    setErr(null);
    setEntrando(true);
    try {
      await iniciarSesion(email, pass);
      onLogin();
    } catch (e) {
      setErr("Email o contraseña incorrectos.");
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div style={{ flex: 1, background: NAVY, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <Lock size={28} color="#fff" />
        </div>
        <div style={{ fontWeight: 800, letterSpacing: 1.5, color: "#fff", fontSize: 18 }}>PROPACKING VIDRIO</div>
        <div style={{ letterSpacing: 3, color: ACCENT, fontSize: 10, fontWeight: 700, marginTop: 3 }}>PANEL DE ADMINISTRACIÓN</div>
      </div>
      <div style={{ background: "#fff", borderRadius: 22, padding: "22px 20px" }}>
        <div style={{ fontSize: 12, color: SUB, marginBottom: 6, fontWeight: 600 }}>Email</div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@propacking.com.ar"
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE_COOL}`, borderRadius: 13, padding: "13px 15px", fontSize: 14.5, outline: "none", marginBottom: 14 }} />
        <div style={{ fontSize: 12, color: SUB, marginBottom: 6, fontWeight: 600 }}>Contraseña</div>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
          onKeyDown={(e) => { if (e.key === "Enter") ingresar(); }}
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE_COOL}`, borderRadius: 13, padding: "13px 15px", fontSize: 14.5, outline: "none", marginBottom: 18 }} />
        {err && (
          <div style={{ background: "#F9E1E1", border: "1px solid #E0B8B8", borderRadius: 11, padding: "10px 12px", marginBottom: 14, fontSize: 12.5, color: "#A83232", fontWeight: 600 }}>{err}</div>
        )}
        <button onClick={ingresar} disabled={!email || !pass || entrando} style={{ ...primaryBtn, opacity: (!email || !pass || entrando) ? 0.6 : 1, cursor: (!email || !pass || entrando) ? "not-allowed" : "pointer" }}>
          {entrando ? "Ingresando…" : <>Ingresar <ArrowRight size={18} /></>}
        </button>
        <div style={{ fontSize: 11, color: FAINT, textAlign: "center", marginTop: 12 }}>Acceso exclusivo del equipo de ProPacking.</div>
      </div>
      <button onClick={onExit} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 20, cursor: "pointer" }}>← Volver a la app</button>
    </div>
  );
}

function AdminPanel({ onExit }) {
  const [tab, setTab] = useState("pedidos");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: IVORY, overflow: "hidden" }}>
      {/* Header admin */}
      <div style={{ background: NAVY, padding: "18px 20px 16px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: 1.2, fontSize: 14 }}>PROPACKING VIDRIO</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>Panel de administración</div>
          </div>
          <button onClick={() => { cerrarSesion(); onExit(); }} style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <LogOut size={18} color="#fff" />
          </button>
        </div>
      </div>

      {/* Tabs admin */}
      <div style={{ display: "flex", gap: 8, padding: "14px 20px", background: PAPER, borderBottom: `1px solid ${LINE_COOL}` }}>
        <button onClick={() => setTab("pedidos")} style={adminTab(tab === "pedidos")}>
          <Inbox size={16} /> Pedidos
        </button>
        <button onClick={() => setTab("precios")} style={adminTab(tab === "precios")}>
          <Tag size={16} /> Precios
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "pedidos" ? <AdminPedidos /> : <AdminPrecios />}
      </div>
    </div>
  );
}

function AdminPedidos() {
  const [filtro, setFiltro] = useState("todos");
  const [abierto, setAbierto] = useState(null);
  const [todas, setTodas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  const recargarPedidos = () => {
    setCargando(true);
    cargarSolicitudes()
      .then((lista) => { setTodas(lista); setErrorCarga(false); })
      .catch((err) => { console.error(err); setErrorCarga(true); })
      .finally(() => setCargando(false));
  };

  useEffect(() => { recargarPedidos(); }, []);

  const cambiarEstado = async (solicitudId, nuevoEstado) => {
    try {
      await cambiarEstadoSolicitud(solicitudId, nuevoEstado);
      setTodas((prev) => prev.map((p) => p.id === solicitudId ? { ...p, estado: nuevoEstado } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const pedidos = todas.filter((p) => {
    if (filtro === "todos") return true;
    if (filtro === "pedidos") return p.tipo === "pedido";
    if (filtro === "cotizaciones") return p.tipo === "cotizacion";
    return p.estado === filtro;
  });

  const pendientes = todas.filter((p) => p.estado === "pendiente").length;

  return (
    <div style={{ padding: "18px 20px 24px" }}>
      {/* Resumen arriba */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={statCard}>
          <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: -0.5 }}>{pendientes}</div>
          <div style={{ fontSize: 11.5, color: SUB, fontWeight: 600 }}>Pendientes</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: -0.5 }}>{todas.length}</div>
          <div style={{ fontSize: 11.5, color: SUB, fontWeight: 600 }}>Total</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 14, margin: "0 -20px 14px", padding: "0 20px" }}>
        {[["todos", "Todos"], ["pedidos", "Pedidos"], ["cotizaciones", "Cotizaciones"], ["pendiente", "Pendientes"]].map(([id, l]) => (
          <button key={id} onClick={() => setFiltro(id)} style={chip(filtro === id)}>{l}</button>
        ))}
      </div>

      {/* Estados de carga */}
      {cargando && (
        <div style={{ textAlign: "center", padding: "40px 0", fontSize: 13.5, color: SUB }}>Cargando pedidos…</div>
      )}
      {!cargando && errorCarga && (
        <div style={{ background: "#F9E1E1", border: "1px solid #E0B8B8", borderRadius: 14, padding: "14px 16px", fontSize: 12.5, color: "#A83232", fontWeight: 600 }}>
          No se pudieron cargar los pedidos. Verificá que estés con la sesión de admin iniciada.
        </div>
      )}
      {!cargando && !errorCarga && pedidos.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", fontSize: 13.5, color: SUB }}>
          Todavía no hay {filtro === "cotizaciones" ? "cotizaciones" : filtro === "pedidos" ? "pedidos" : "solicitudes"} para mostrar.
        </div>
      )}

      {/* Lista de pedidos */}
      {!cargando && pedidos.map((p) => {
        const est = ESTADOS[p.estado];
        const isOpen = abierto === p.num;
        return (
          <div key={p.num} style={{ background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 18, marginBottom: 12, overflow: "hidden" }}>
            <button onClick={() => setAbierto(isOpen ? null : p.num)}
              style={{ width: "100%", padding: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: p.tipo === "pedido" ? NAVY : NAVY_WASH, color: p.tipo === "pedido" ? "#fff" : NAVY, letterSpacing: 0.3 }}>
                    {p.tipo === "pedido" ? "PEDIDO" : "COTIZ."}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>{p.num}</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: "4px 9px", borderRadius: 7, background: est.bg, color: est.color }}>{est.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{p.cliente}</div>
                  <div style={{ fontSize: 12, color: SUB }}>{p.empresa || "Particular"} · {p.fecha}</div>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 6 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: -0.3 }}>{money(p.total)}</div>
                    <div style={{ fontSize: 11, color: FAINT }}>{p.items.reduce((a, i) => a + i.cant, 0)} u.</div>
                  </div>
                  <ChevronDown size={18} color={FAINT} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </div>
              </div>
              {p.requiere24 && (
                <div style={{ marginTop: 10, fontSize: 11.5, color: "#8A5A00", background: "#FBF1DD", borderRadius: 9, padding: "6px 10px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Clock4 size={13} /> Preparación 24 hs (+200 u.)
                </div>
              )}
            </button>

            {isOpen && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${LINE_COOL}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 8px" }}>Productos</div>
                {p.items.map((it, k) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: INK }}>{it.cant} × {it.n} <span style={{ color: FAINT }}>({it.tapa})</span></span>
                    <span style={{ fontWeight: 600, color: INK }}>{money(it.sub)}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 8px" }}>Contacto</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`https://wa.me/${p.tel.replace(/\D/g, "")}`} style={{ ...contactBtn, background: "#1FA855", color: "#fff", textDecoration: "none" }}>
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                  <a href={`tel:${p.tel}`} style={{ ...contactBtn, textDecoration: "none" }}><Phone size={16} /> Llamar</a>
                  <a href={`mailto:${p.email}`} style={{ ...contactBtn, textDecoration: "none" }}><Mail size={16} /> Email</a>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 8px" }}>Cambiar estado</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.entries(ESTADOS).map(([id, e]) => (
                    <span key={id} onClick={() => cambiarEstado(p.id, id)} style={{ fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 9, cursor: "pointer",
                      background: p.estado === id ? e.bg : PAPER, color: p.estado === id ? e.color : SUB, border: `1px solid ${p.estado === id ? e.bg : LINE_COOL}` }}>
                      {e.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AdminPrecios() {
  const { productos: productosCat, recargar } = useCatalogo();
  const [proveedores, setProveedores] = useState([]);
  const [prov, setProv] = useState("");
  const [pct, setPct] = useState("");
  const [aplicado, setAplicado] = useState(null);
  const [aplicando, setAplicando] = useState(false);

  // Cargar proveedores reales de la base
  useEffect(() => {
    cargarProveedores()
      .then((lista) => {
        setProveedores(lista);
        if (lista.length) setProv(lista[0].id);
      })
      .catch((err) => console.error(err));
  }, []);

  const provActual = proveedores.find((x) => x.id === prov);

  const aplicar = async () => {
    if (!prov || !pct) return;
    setAplicando(true);
    setAplicado(null);
    try {
      const afectados = await ajustarPreciosProveedor(prov, pct);
      await recargar(); // refresca los precios que se muestran abajo
      const signo = Number(pct) > 0 ? "+" : "";
      setAplicado({
        ok: true,
        msg: `Se aplicó ${signo}${pct}% a ${provActual?.nombre}. Se actualizaron ${afectados} precios.`,
      });
      setPct("");
    } catch (err) {
      console.error(err);
      setAplicado({
        ok: false,
        msg: "No se pudo aplicar el ajuste. Verificá que estés con la sesión de admin iniciada.",
      });
    } finally {
      setAplicando(false);
      setTimeout(() => setAplicado(null), 6000);
    }
  };

  return (
    <div style={{ padding: "18px 20px 24px" }}>
      {/* Ajuste por proveedor */}
      <div style={{ background: NAVY, borderRadius: 20, padding: "18px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <TrendingUp size={18} color={ACCENT} />
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Ajuste por proveedor</div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>Subí o bajá el precio de todo un proveedor de una vez.</div>

        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontWeight: 600 }}>Proveedor</div>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <select value={prov} onChange={(e) => setProv(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", appearance: "none", border: "none", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontWeight: 600, color: INK, background: "#fff", cursor: "pointer" }}>
            {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          <ChevronDown size={18} color={FAINT} style={{ position: "absolute", right: 12, top: 13, pointerEvents: "none" }} />
        </div>
        {provActual?.tipo && (
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>{provActual.tipo}</div>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", marginBottom: 6, fontWeight: 600 }}>Porcentaje (%)</div>
            <input type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="Ej: 12"
              style={{ width: "100%", boxSizing: "border-box", border: "none", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontWeight: 700, color: INK, background: "#fff", outline: "none" }} />
          </div>
          <button onClick={aplicar} disabled={!pct || aplicando}
            style={{ background: ACCENT, color: NAVY, border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 800, cursor: (pct && !aplicando) ? "pointer" : "not-allowed", opacity: (pct && !aplicando) ? 1 : 0.5 }}>
            {aplicando ? "Aplicando…" : "Aplicar"}
          </button>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>Usá negativo para bajar (ej: −5).</div>
      </div>

      {aplicado && (
        <div style={{ background: aplicado.ok ? "#E1F3E7" : "#F9E1E1", border: `1px solid ${aplicado.ok ? "#B8E0C4" : "#E0B8B8"}`, borderRadius: 14, padding: "12px 14px", marginBottom: 18, fontSize: 12.5, color: aplicado.ok ? "#2C7A45" : "#A83232", fontWeight: 600, display: "flex", gap: 8 }}>
          <Check size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {aplicado.msg}
        </div>
      )}

      {/* Lista de productos con precios editables */}
      <div style={{ fontSize: 15, fontWeight: 800, color: INK, marginBottom: 4, letterSpacing: -0.2 }}>Precios por producto</div>
      <div style={{ fontSize: 12, color: SUB, marginBottom: 14 }}>Estos son los precios reales del catálogo.</div>

      {productosCat.map((p) => (
        <div key={p.id} style={{ background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 18, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: IVORY, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <ProductImage producto={p} size={34} tapa={tapasDe(p)[0]} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{p.nombre}</div>
              <div style={{ fontSize: 11.5, color: FAINT }}>Cod. {p.cod}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TAPAS_SEL.filter((t) => p.precios[t] != null).map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: IVORY, borderRadius: 11, padding: "9px 12px" }}>
                <span style={{ fontSize: 12, color: SUB, fontWeight: 600 }}>{t.replace("Tapa ", "")}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: NAVY }}>{money(p.precios[t]).replace(",00", "")}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ SMALL PARTS ============================ */
const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 40, height: 40, borderRadius: 13, background: NAVY, display: "grid", placeItems: "center" }}>
      <Jar size={26} tapa="Tapa Dorada" />
    </div>
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontWeight: 800, letterSpacing: 1.5, color: NAVY, fontSize: 15 }}>PROPACKING</div>
      <div style={{ letterSpacing: 5, color: ACCENT, fontSize: 9, fontWeight: 700, marginTop: 2 }}>VIDRIO</div>
    </div>
  </div>
);

const Section = ({ title, action, onAction, children }) => (
  <div style={{ marginTop: 26 }}>
    <div style={{ display: "flex", alignItems: "center", padding: "0 20px 12px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: INK, letterSpacing: -0.3 }}>{title}</div>
      {action && <button onClick={onAction} style={{ marginLeft: "auto", background: "none", border: "none", color: NAVY, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>{action} <ChevronRight size={15} /></button>}
    </div>
    {children}
  </div>
);

const SearchBox = ({ value, onChange, onFocus, placeholder }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, background: PAPER, border: `1px solid ${LINE_COOL}`,
    borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px -6px rgba(18,42,79,0.12)" }}>
    <Search size={19} color={FAINT} />
    <input value={value} onChange={(e) => onChange && onChange(e.target.value)} onFocus={onFocus}
      placeholder={placeholder} style={{ border: "none", outline: "none", flex: 1, fontSize: 14.5, background: "transparent", color: INK }} />
  </div>
);

const Field = ({ label, ...rest }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, color: SUB, marginBottom: 6, fontWeight: 600 }}>{label}</div>
    <input {...rest} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE_COOL}`, borderRadius: 13,
      padding: "13px 15px", fontSize: 14.5, outline: "none", background: PAPER, color: INK }} />
  </div>
);

const Line = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: SUB, padding: "4px 0" }}>
    <span>{label}</span><span style={{ color: INK, fontWeight: 600 }}>{value}</span>
  </div>
);

const EmptyState = ({ icon: Ic, title, text, cta, onCta }) => (
  <div style={{ textAlign: "center", padding: "56px 32px" }}>
    <div style={{ width: 72, height: 72, borderRadius: 22, background: PAPER, border: `1px solid ${LINE_COOL}`, display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
      <Ic size={32} color="#C3CBD6" />
    </div>
    <div style={{ fontWeight: 800, color: INK, fontSize: 17, letterSpacing: -0.3 }}>{title}</div>
    <div style={{ fontSize: 13.5, marginTop: 6, color: SUB, lineHeight: 1.5, maxWidth: 260, margin: "6px auto 0" }}>{text}</div>
    {cta && <button onClick={onCta} style={{ ...primaryBtn, marginTop: 22, width: "auto", padding: "12px 24px", display: "inline-flex" }}>{cta}</button>}
  </div>
);

const Trust = () => (
  <div style={{ padding: "26px 20px 8px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[[Clock, "Rápido y simple", "Cotizá en pocos pasos desde el celular."],
        [ShieldCheck, "Seguro", "Tus datos y consultas siempre protegidos."],
        [FileText, "Historial", "Revisá y repetí cotizaciones anteriores."],
        [MessageCircle, "Atención personal", "Respondemos en el menor tiempo posible."]].map(([Ic, t, d], i) => (
        <div key={i} style={{ background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 16, padding: "14px" }}>
          <Ic size={20} color={NAVY} strokeWidth={2} />
          <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginTop: 8 }}>{t}</div>
          <div style={{ fontSize: 11, color: SUB, lineHeight: 1.4, marginTop: 2 }}>{d}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================ STYLE OBJECTS ============================ */
const tapaSwatch = (t) => t === "Tapa Negra" ? "#2B2B2E" : t === "Tapa Blanca" ? "#F0F0EC" : t === "Tapa Roja" ? "#B23A3A" : t === "Sin tapa" ? "#fff" : "#D8B45E";
const avatarBtn = { width: 42, height: 42, borderRadius: 14, border: `1px solid ${LINE_COOL}`, display: "grid", placeItems: "center", background: PAPER, cursor: "pointer" };
const iconBtn = { width: 42, height: 42, borderRadius: 14, border: `1px solid ${LINE_COOL}`, display: "grid", placeItems: "center", background: PAPER, cursor: "pointer", flexShrink: 0 };
const roundBtn = { width: 42, height: 42, borderRadius: 42, border: "none", display: "grid", placeItems: "center", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", cursor: "pointer", boxShadow: "0 4px 14px -4px rgba(0,0,0,0.18)" };
const catTile = { flex: "0 0 auto", width: 80, background: "none", border: "none", padding: 0, display: "grid", justifyItems: "center", cursor: "pointer" };
const featCard = { flex: "0 0 auto", width: 168, background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 22, padding: 14, cursor: "pointer", boxShadow: "0 8px 24px -16px rgba(18,42,79,0.25)" };
const featPlus = { width: 38, height: 38, borderRadius: 13, background: NAVY, color: "#fff", border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 };
const rowCard = { display: "flex", gap: 14, alignItems: "center", background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 20, padding: 14, marginBottom: 12, cursor: "pointer", boxShadow: "0 6px 20px -16px rgba(18,42,79,0.22)" };
const budgetCard = { background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 20, padding: 16, marginBottom: 12, boxShadow: "0 6px 20px -16px rgba(18,42,79,0.2)" };
const addBtn = { width: 46, height: 46, borderRadius: 15, background: NAVY, color: "#fff", border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 };
const primaryBtn = { width: "100%", background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_2} 100%)`, color: "#fff", border: "none", borderRadius: 16, padding: "16px 18px", fontSize: 15.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: "0 12px 26px -14px rgba(18,42,79,0.6)", letterSpacing: -0.2 };
const ghostBtn = { width: "100%", background: PAPER, color: NAVY, border: `1px solid ${LINE_COOL}`, borderRadius: 16, padding: "14px", fontSize: 14.5, fontWeight: 700, cursor: "pointer" };
const chip = (on) => ({ flex: "0 0 auto", padding: "9px 16px", borderRadius: 22, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: `1px solid ${on ? NAVY : LINE_COOL}`, background: on ? NAVY : PAPER, color: on ? "#fff" : SUB, whiteSpace: "nowrap" });
const segTab = (on) => ({ flex: 1, padding: "10px 8px", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer",
  border: "none", background: on ? PAPER : "transparent", color: on ? NAVY : FAINT, boxShadow: on ? "0 2px 8px -4px rgba(18,42,79,0.2)" : "none",
  outline: on ? `1px solid ${LINE_COOL}` : "none" });
const tapaPill = (on) => ({ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 14px", borderRadius: 13, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: `1.5px solid ${on ? NAVY : LINE_COOL}`, background: on ? NAVY_WASH : PAPER, color: on ? NAVY : INK });
const adminTab = (on) => ({ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 8px", borderRadius: 12, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
  border: "none", background: on ? NAVY : "transparent", color: on ? "#fff" : SUB });
const statCard = { flex: 1, background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 16, padding: "14px 16px" };
const contactBtn = { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", borderRadius: 11, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
  border: `1px solid ${LINE_COOL}`, background: PAPER, color: NAVY };

function Screen({ children }) {
  return <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: IVORY }}>{children}</div>;
}

/* Pantalla Cuenta del cliente: incluye el acceso discreto al panel admin */
function CuentaScreen({ onAdmin }) {
  return (
    <Screen>
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: INK, letterSpacing: -0.5 }}>Mi cuenta</h2>
        <p style={{ fontSize: 13.5, color: SUB, margin: "4px 0 0" }}>Gestioná tus datos y cotizaciones.</p>
      </div>
      <div style={{ padding: "20px" }}>
        {[[User, "Mis datos", "Nombre, empresa y contacto"],
          [FileText, "Mis cotizaciones", "Historial de solicitudes enviadas"],
          [ShieldCheck, "Privacidad", "Cómo cuidamos tu información"]].map(([Ic, t, d], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: PAPER, border: `1px solid ${LINE_COOL}`, borderRadius: 16, padding: 16, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: IVORY, display: "grid", placeItems: "center" }}><Ic size={20} color={NAVY} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{t}</div>
              <div style={{ fontSize: 12, color: SUB }}>{d}</div>
            </div>
            <ChevronRight size={18} color={FAINT} />
          </div>
        ))}
      </div>

      {/* Acceso al panel de administración (equipo ProPacking) */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: FAINT, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 8 }}>Equipo ProPacking</div>
        <button onClick={onAdmin} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: NAVY, border: "none", borderRadius: 16, padding: 16, cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center" }}><Settings size={20} color="#fff" /></div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Panel de administración</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Precios y pedidos · acceso interno</div>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
        </button>
      </div>
    </Screen>
  );
}

/* ============================ ROOT ============================ */
/* Carga el catálogo desde Supabase una vez y lo expone a toda la app */
function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = () => {
    return cargarCatalogo()
      .then((p) => { setProductos(p); })
      .catch((err) => { console.error(err); });
  };

  useEffect(() => {
    let vivo = true;
    cargarCatalogo()
      .then((p) => { if (vivo) { setProductos(p); setCargando(false); } })
      .catch((err) => { if (vivo) { console.error(err); setError(err); setCargando(false); } });
    return () => { vivo = false; };
  }, []);

  return (
    <CatalogoCtx.Provider value={{ productos, cargando, error, recargar }}>
      {children}
    </CatalogoCtx.Provider>
  );
}

function PantallaCarga({ error }) {
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center", background: IVORY, padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        {error ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "#FBE4E4", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <X size={30} color="#8A2C2C" />
            </div>
            <div style={{ fontWeight: 700, color: INK, fontSize: 16 }}>No pudimos cargar el catálogo</div>
            <div style={{ fontSize: 13, color: SUB, marginTop: 6, maxWidth: 260 }}>Revisá tu conexión y recargá la página.</div>
          </>
        ) : (
          <>
            <Loader2 size={34} color={NAVY} className="spin" style={{ margin: "0 auto 14px" }} />
            <div style={{ fontSize: 14, color: SUB, fontWeight: 600 }}>Cargando catálogo...</div>
          </>
        )}
      </div>
    </div>
  );
}

function AppInner() {
  const { cargando, error } = useCatalogo();
  const [vista, setVista] = useState("cliente");
  const [tab, setTab] = useState("home");
  const [product, setProduct] = useState(null);
  const [modo, setModo] = useState("pedido");
  const go = (t) => setTab(t);
  const openProduct = (p) => { setProduct(p); setTab("detail"); };
  const startFlow = (m) => { setModo(m); setTab("form"); };

  return (
    <div style={{ minHeight: "100vh", background: IVORY, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", boxShadow: "0 0 60px rgba(0,0,0,0.08)" }}>
      {vista === "admin-login" && <AdminLogin onLogin={() => setVista("admin")} onExit={() => setVista("cliente")} />}
      {vista === "admin" && <AdminPanel onExit={() => setVista("cliente")} />}
      {vista === "cliente" && (
        (cargando || error) && tab === "home" ? <PantallaCarga error={error} /> : (
        <>
          {tab === "home" && <HomeScreen go={go} openProduct={openProduct} />}
          {tab === "list" && <ListScreen go={go} openProduct={openProduct} />}
          {tab === "detail" && product && <DetailScreen product={product} go={go} />}
          {tab === "budget" && <BudgetScreen go={go} startFlow={startFlow} />}
          {tab === "form" && <FormScreen go={go} modo={modo} />}
          {tab === "done" && <DoneScreen go={go} modo={modo} />}
          {tab === "account" && <CuentaScreen onAdmin={() => setVista("admin-login")} />}
          {tab !== "detail" && tab !== "form" && tab !== "done" && <TabBar tab={tab} go={go} />}
        </>
        )
      )}
    </div>
  );
}

export default function App() {
  return (
    <CatalogoProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </CatalogoProvider>
  );
}
