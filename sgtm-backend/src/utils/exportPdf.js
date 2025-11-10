const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.exportToPDF = async (datos, campos, nombreArchivo, rutaDestino, titulo = 'Reporte') => {
  if (!fs.existsSync(rutaDestino)) {
    fs.mkdirSync(rutaDestino, { recursive: true });
  }

  const rutaCompleta = path.join(rutaDestino, `${nombreArchivo}.pdf`);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(rutaCompleta));

  // Título
  doc.fontSize(20).text(titulo, { align: 'center' });
  doc.moveDown();

  // Fecha
  doc.fontSize(10).text(`Generado el: ${new Date().toLocaleString('es-ES')}`, { align: 'right' });
  doc.moveDown(2);

  // Tabla
  if (datos.length > 0) {
    const startY = doc.y;
    const cellHeight = 20;
    const cellPadding = 5;
    const pageWidth = doc.page.width - 100;
    const columnCount = campos.length;
    const columnWidth = pageWidth / columnCount;

    // Encabezados
    doc.fontSize(10).font('Helvetica-Bold');
    campos.forEach((campo, index) => {
      doc.text(campo, 50 + (index * columnWidth), startY, {
        width: columnWidth - cellPadding,
        align: 'left'
      });
    });

    // Línea debajo de encabezados
    doc.moveTo(50, startY + cellHeight).lineTo(50 + pageWidth, startY + cellHeight).stroke();

    // Datos
    doc.font('Helvetica');
    datos.forEach((fila, filaIndex) => {
      const y = startY + cellHeight + (filaIndex * cellHeight) + cellPadding;
      
      // Nueva página si es necesario
      if (y + cellHeight > doc.page.height - 50) {
        doc.addPage();
        const newStartY = 50;
        campos.forEach((campo, index) => {
          doc.font('Helvetica-Bold').text(campo, 50 + (index * columnWidth), newStartY, {
            width: columnWidth - cellPadding,
            align: 'left'
          });
        });
        doc.moveTo(50, newStartY + cellHeight).lineTo(50 + pageWidth, newStartY + cellHeight).stroke();
        doc.font('Helvetica');
        return;
      }

      campos.forEach((campo, colIndex) => {
        const valor = fila[campo] || '';
        doc.text(String(valor), 50 + (colIndex * columnWidth), y, {
          width: columnWidth - cellPadding,
          align: 'left'
        });
      });
    });
  } else {
    doc.text('No hay datos para mostrar', { align: 'center' });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(rutaCompleta));
    doc.on('error', reject);
  });
};

