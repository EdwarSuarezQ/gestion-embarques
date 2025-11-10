const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.exportToExcel = async (datos, campos, nombreArchivo, rutaDestino) => {
  if (!fs.existsSync(rutaDestino)) {
    fs.mkdirSync(rutaDestino, { recursive: true });
  }

  // Crear workbook
  const workbook = XLSX.utils.book_new();

  // Preparar datos con solo los campos especificados
  const datosFormateados = datos.map(fila => {
    const filaFormateada = {};
    campos.forEach(campo => {
      filaFormateada[campo] = fila[campo] || '';
    });
    return filaFormateada;
  });

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(datosFormateados);

  // Ajustar ancho de columnas
  const columnWidths = campos.map(campo => ({ wch: Math.max(campo.length, 15) }));
  worksheet['!cols'] = columnWidths;

  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

  // Escribir archivo
  const rutaCompleta = path.join(rutaDestino, `${nombreArchivo}.xlsx`);
  XLSX.writeFile(workbook, rutaCompleta);

  return rutaCompleta;
};

