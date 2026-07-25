import apiClient from './apiClient';
import { PRODUCTS } from '../hooks/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(params = {}) {
  if (USE_MOCK) {
    await delay(400);
    let result = [...PRODUCTS];

    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (params.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (params.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (params.sort === 'featured') result.sort((a, b) => Number(b.featured) - Number(a.featured));

    return { data: result, total: result.length };
  }
  const { data } = await apiClient.get('/products', { params });
  return data;
}

export async function getProductById(id) {
  if (USE_MOCK) {
    await delay(300);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw { message: 'Product not found', status: 404 };
    return { data: product };
  }
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function getFeaturedProducts() {
  if (USE_MOCK) {
    await delay(300);
    return { data: PRODUCTS.filter((p) => p.featured) };
  }
  const { data } = await apiClient.get('/products', { params: { featured: true } });
  return data;
}
