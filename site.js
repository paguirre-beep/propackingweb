// =====================================================================
//  DATOS DE LA EMPRESA — Editá acá y se actualiza en toda la web.
// =====================================================================

export const site = {
  nombre: "ProPacking",
  claim: "Insumos para embalaje",
  aniosExperiencia: 35,

  // --- Contacto ----------------------------------------------------
  whatsapp: "5493816785474",              // solo números, con código país
  telefonoVisible: "+54 9 381 678 5474",
  telefonoAlt: "+54 9 381 260 8649",
  email: "administracion@ins-propacking.com",
  direccion: "Av. República del Líbano 1820, San Miguel de Tucumán",
  whatsappMensaje: "Hola ProPacking, quería hacer una consulta sobre insumos de embalaje.",

  redes: {
    instagram: "https://instagram.com/propacking.tuc",
  },
};

export const whatsappLink = () =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMensaje)}`;
