// Utilidades para manejo de fechas

exports.formatDateDDMMYYYY = (date) => {
  if (!date) return '';
  if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return date;
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

exports.parseDateDDMMYYYY = (dateString) => {
  if (!dateString || !dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return null;
  }
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

exports.formatDateDDMMYYYYHHmm = (date) => {
  if (!date) return '';
  if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/)) {
    return date;
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

exports.getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

exports.getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
};

exports.getStartOfQuarter = () => {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  return new Date(now.getFullYear(), quarter * 3, 1);
};

exports.getEndOfQuarter = () => {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  return new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59);
};

