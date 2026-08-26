import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Representantes from "./components/Representantes";
import Productos from "./components/Productos";
import Nosotros from "./components/Nosotros";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import FloatingWhatsapp from "./components/FloatingWhatsapp";
import ProductoPage from "./components/ProductoPage";
import { getProducto } from "./productos";

export default function App() {
  const [productoId, setProductoId] = useState(null);

  // Al abrir un producto, subir al tope
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productoId]);

  const producto = productoId ? getProducto(productoId) : null;

  if (producto) {
    return (
      <>
        <ProductoPage producto={producto} onBack={() => setProductoId(null)} />
        <FloatingWhatsapp />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Representantes />
        <Productos onOpen={setProductoId} />
        <Nosotros />
        <CTA />
      </main>
      <Footer />
      <FloatingWhatsapp />
    </>
  );
}
