import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportToPDF = async (data, headers, filename, title = 'Reporte') => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Título
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();

    // Fecha
    doc.fontSize(10).text(`Generado el: ${new Date().toLocaleString('es-ES')}`, {
      align: 'center',
    });
    doc.moveDown(2);

    // Tabla
    const tableTop = doc.y;
    const itemHeight = 20;
    const tableLeft = 50;
    const tableWidth = 500;
    const columnWidth = tableWidth / headers.length;

    // Headers
    doc.fontSize(12).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header.label || header.key, tableLeft + i * columnWidth, tableTop, {
        width: columnWidth,
        align: 'left',
      });
    });

    // Datos
    doc.fontSize(10).font('Helvetica');
    data.forEach((row, rowIndex) => {
      const y = tableTop + itemHeight + rowIndex * itemHeight;
      headers.forEach((header, colIndex) => {
        const value = row[header.key] || '';
        doc.text(String(value), tableLeft + colIndex * columnWidth, y, {
          width: columnWidth,
          align: 'left',
        });
      });
    });

    doc.end();

    stream.on('finish', () => {
      resolve({
        filePath,
        filename,
        size: fs.statSync(filePath).size,
      });
    });

    stream.on('error', reject);
  });
};
