# ProPacking — Landing

Landing institucional para **ProPacking · Insumos para embalaje**.
React + Vite + Tailwind CSS + Framer Motion.

Colores: azul marino `#0D2F6F` + rojo `#E30613`. Tipografía: Poppins + Open Sans.

---

## 1. Editá tus datos

Abrí `src/site.js` y cambiá:
- `whatsapp` → tu número con código de país, solo números. Ej: `5493811234567`
- `telefonoVisible`, `email`, `direccion`
- `redes` → Instagram / Facebook (o dejá `""` para ocultarlos)

Con eso todos los botones de WhatsApp quedan funcionando.

---

## 2. Las fotos (opcional)

La web funciona con placeholders. Para poner fotos reales:
- **Hero:** guardá `public/hero.jpg` y descomentá la línea marcada en `src/components/Hero.jsx`.
- **Depósito:** `public/deposito.jpg`, descomentá en `Nosotros.jsx`.

---

## 3. Verla en tu compu

En una terminal, dentro de la carpeta del proyecto:

```
npm install
npm run dev
```

Abrí `http://localhost:5173`.

---

## 4. Subir a GitHub y publicar en Vercel

1. **GitHub:** repo nuevo → "uploading an existing file" → arrastrás todo
   (menos `node_modules`, que el `.gitignore` ya excluye).
2. **Vercel:** entrás con GitHub → Add New Project → elegís el repo → Deploy.
   Vercel detecta Vite solo. En 1-2 min tenés la URL online.

---

## Estructura

```
src/
├─ site.js              ← DATOS DE CONTACTO
├─ App.jsx              arma las secciones
└─ components/
   ├─ Navbar.jsx
   ├─ Hero.jsx
   ├─ Productos.jsx
   ├─ PorQue.jsx
   ├─ Nosotros.jsx
   ├─ CTA.jsx
   ├─ Footer.jsx
   ├─ Logo.jsx
   ├─ WhatsappButton.jsx
   └─ FloatingWhatsapp.jsx
```
