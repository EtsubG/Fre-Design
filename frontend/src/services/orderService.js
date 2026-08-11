import apiClient from './apiClient';
import { MOCK_ORDERS } from '../hooks/data/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createOrder(orderPayload) {
  if (USE_MOCK) {
    await delay(1200);
    const orderNumber = `FD-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      data: {
        ...orderPayload,
        orderNumber,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 28 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    };
  }
  const { data } = await apiClient.post('/orders', orderPayload);
  return data;
}

export async function getOrders() {
  if (USE_MOCK) {
    await delay(500);
    return { data: MOCK_ORDERS };
  }
  const { data } = await apiClient.get('/orders');
  return data;
}

export async function getOrderById(orderNumber) {
  if (USE_MOCK) {
    await delay(400);
    const order = MOCK_ORDERS.find((o) => o.id === orderNumber);
    if (!order) throw { message: 'Order not found', status: 404 };
    return { data: order };
  }
  const { data } = await apiClient.get(`/orders/${orderNumber}`);
  return data;
}
