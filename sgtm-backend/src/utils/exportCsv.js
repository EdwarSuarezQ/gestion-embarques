const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

exports.exportToCSV = async (datos, campos, nombreArchivo, rutaDestino) => {
  if (!fs.existsSync(rutaDestino)) {
    fs.mkdirSync(rutaDestino, { recursive: true });
  }

  const rutaCompleta = path.join(rutaDestino, `${nombreArchivo}.csv`);

  const csvWriter = createCsvWriter({
    path: rutaCompleta,
    header: campos.map(campo => ({ id: campo, title: campo }))
  });

  await csvWriter.writeRecords(datos);
  return rutaCompleta;
};

