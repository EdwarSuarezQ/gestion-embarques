import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportToCSV = async (data, headers, filename) => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  // Crear directorio si no existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);

  // Preparar headers para csv-writer
  const csvHeaders = headers.map((header) => ({
    id: header.key,
    title: header.label || header.key,
  }));

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: csvHeaders,
    encoding: 'utf8',
  });

  await csvWriter.writeRecords(data);

  return {
    filePath,
    filename,
    size: fs.statSync(filePath).size,
  };
};
