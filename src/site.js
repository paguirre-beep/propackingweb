// =====================================================================
//  DATOS DE LA EMPRESA — Editá acá y se actualiza en toda la web.
// =====================================================================

export const site = {
  nombre: "ProPacking",
  claim: "Insumos para embalaje",
  aniosExperiencia: 35,

  // --- Contacto (EDITAR con tus datos reales) ----------------------
  whatsapp: "5493810000000",              // solo números, con código país
  telefonoVisible: "+54 9 381 000-0000",
  email: "contacto@propacking.com.ar",
  direccion: "San Miguel de Tucumán, Tucumán",
  whatsappMensaje: "Hola ProPacking, quería hacer una consulta sobre insumos de embalaje.",

  redes: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
};

export const whatsappLink = () =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMensaje)}`;
