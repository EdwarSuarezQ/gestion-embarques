import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportToJSON = async (data, filename) => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  return {
    filePath,
    filename,
    size: fs.statSync(filePath).size,
  };
};
