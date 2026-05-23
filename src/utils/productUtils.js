export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', variant: 'danger' };
  if (stock < 20) return { label: 'Low Stock', variant: 'warning' };
  return { label: 'In Stock', variant: 'success' };
};

export const filterProducts = (products, filters) => {
  return products.filter(product => {
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(product.category)) return false;
    }
    if (filters.rating) {
      if (product.rating < parseFloat(filters.rating)) return false;
    }
    if (filters.stockStatus) {
      const status = getStockStatus(product.stock).label;
      if (filters.stockStatus !== status) return false;
    }
    return true;
  });
};

export const sortProducts = (products, sortBy, order) => {
  return [...products].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
