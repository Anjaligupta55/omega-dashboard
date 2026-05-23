const BASE_URL = 'https://dummyjson.com/products';

export const productApi = {
  getProducts: async ({ limit = 30, skip = 0 } = {}) => {
    const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    return res.json();
  },
  searchProducts: async ({ query, limit = 30, skip = 0 }) => {
    const res = await fetch(`${BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`);
    return res.json();
  },
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },
  getProductById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
  }
};
