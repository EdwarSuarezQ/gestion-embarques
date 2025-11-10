// Funciones auxiliares

exports.formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

exports.parseDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

exports.buildQuery = (queryParams, searchFields = []) => {
  const query = {};
  
  // Búsqueda por texto
  if (queryParams.search && searchFields.length > 0) {
    query.$or = searchFields.map(field => ({
      [field]: { $regex: queryParams.search, $options: 'i' }
    }));
  }
  
  // Filtros específicos
  Object.keys(queryParams).forEach(key => {
    if (key !== 'search' && key !== 'page' && key !== 'limit' && key !== 'sort') {
      query[key] = queryParams[key];
    }
  });
  
  return query;
};

exports.buildSort = (sortString) => {
  if (!sortString) return { createdAt: -1 };
  
  const sort = {};
  const parts = sortString.split(',');
  
  parts.forEach(part => {
    const [field, order] = part.split(':');
    sort[field] = order === 'asc' ? 1 : -1;
  });
  
  return sort;
};

exports.calculatePagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / perPage);
  
  return {
    currentPage,
    perPage,
    total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

