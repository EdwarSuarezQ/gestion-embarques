const fs = require('fs');
const path = require('path');

exports.exportToJSON = async (datos, nombreArchivo, rutaDestino) => {
  if (!fs.existsSync(rutaDestino)) {
    fs.mkdirSync(rutaDestino, { recursive: true });
  }

  const rutaCompleta = path.join(rutaDestino, `${nombreArchivo}.json`);
  fs.writeFileSync(rutaCompleta, JSON.stringify(datos, null, 2), 'utf8');
  return rutaCompleta;
};

