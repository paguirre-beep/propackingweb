import { useRef, useState, useEffect } from "react";

/**
 * Box360 — Visor de la caja girando (secuencia de imágenes).
 * Comportamiento:
 *  - Al cargar: gira sola, lento y elegante.
 *  - Al arrastrar (mouse/dedo): el usuario la controla.
 *  - Al soltar: inercia suave, luego retoma el giro automático.
 *
 * Para usar TUS fotos: reemplazá los archivos en /public/caja360/
 * manteniendo los nombres frame_00.png ... frame_NN.png.
 */
export default function Box360({ total = 36 }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);

  const posRef = useRef(0);
  const velRef = useRef(0);
  const draggingRef = useRef(false);
  const autoRef = useRef(true);
  const lastXRef = useRef(0);
  const idleTimer = useRef(null);

  const frames = Array.from({ length: total }, (_, i) =>
    `/caja360/frame_${String(i).padStart(2, "0")}.png`
  );

  // Precarga
  useEffect(() => {
    let done = 0;
    const imgs = frames.map((src) => {
      const im = new Image();
      im.src = src;
      im.onload = im.onerror = () => { done++; if (done === total) setLoaded(true); };
      return im;
    });
    return () => imgs.forEach((im) => (im.onload = im.onerror = null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loop de animación
  useEffect(() => {
    let raf;
    const step = () => {
      if (autoRef.current && !draggingRef.current) {
        posRef.current += 0.28; // giro automático lento
      } else if (!draggingRef.current) {
        posRef.current += velRef.current;
        velRef.current *= 0.94; // inercia
      }
      let p = posRef.current % total;
      if (p < 0) p += total;
      setIndex(Math.floor(p));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = () => containerRef.current?.clientWidth || 1;

  const onDown = (x) => {
    draggingRef.current = true;
    autoRef.current = false;
    lastXRef.current = x;
    velRef.current = 0;
    clearTimeout(idleTimer.current);
  };
  const onMove = (x) => {
    if (!draggingRef.current) return;
    const dx = x - lastXRef.current;
    lastXRef.current = x;
    const delta = (dx / width()) * total * 1.5;
    posRef.current += delta;
    velRef.current = delta;
  };
  const onUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    // tras 2.5s sin tocar, retoma el giro automático
    idleTimer.current = setTimeout(() => { autoRef.current = true; }, 2500);
  };

  useEffect(() => {
    const up = () => onUp();
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => onMove(e.clientX)}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-navy/20 border-t-navy animate-spin" />
        </div>
      )}
      {frames.map((src, i) => (
        <img key={i} src={src} alt="" draggable={false}
          style={{ opacity: i === index && loaded ? 1 : 0 }}
          className="absolute max-w-full max-h-full object-contain pointer-events-none" />
      ))}
      {loaded && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-ink-muted text-xs pointer-events-none">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 12h8M8 12l3-3M8 12l3 3M16 12l-3-3M16 12l-3 3" />
          </svg>
          Arrastrá para girar
        </div>
      )}
    </div>
  );
}
