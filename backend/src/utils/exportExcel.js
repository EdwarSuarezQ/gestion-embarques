import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportToExcel = async (data, headers, filename) => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  // Agregar headers
  worksheet.columns = headers.map((header) => ({
    header: header.label || header.key,
    key: header.key,
    width: 20,
  }));

  // Agregar datos
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Estilizar headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' },
  };

  await workbook.xlsx.writeFile(filePath);

  return {
    filePath,
    filename,
    size: fs.statSync(filePath).size,
  };
};
