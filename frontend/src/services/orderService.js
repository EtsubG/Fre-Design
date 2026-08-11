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

  // Map the flat frontend form to the nested shape the backend expects
  const backendPayload = {
    customerInfo: {
      fullName:        orderPayload.fullName,
      phoneNumber:     orderPayload.phone,
      email:           orderPayload.email,
      deliveryAddress: orderPayload.address,
      city:            orderPayload.city,
      additionalNotes: orderPayload.notes || '',
    },
    measurements: {
      height:         Number(orderPayload.height),
      waist:          Number(orderPayload.waist),
      hips:           Number(orderPayload.hips),
      shoulderWidth:  Number(orderPayload.shoulderWidth),
      sleeveLength:   Number(orderPayload.sleeveLength),
      dressLength:    Number(orderPayload.dressLength),
      // fields required by the schema but not collected in the form default to 0
      waistToFloor:   Number(orderPayload.waistToFloor   || 0),
      shoulderToWaist: Number(orderPayload.shoulderToWaist || 0),
    },
    orderedItem: {
      product:       orderPayload.productId,
      productName:   orderPayload.productName || '',
      selectedColor: orderPayload.fabric || 'custom',
    },
    payment: {
      receiptUrl: orderPayload.referenceImage || 'pending',
      amount:     Number(orderPayload.price)  || 0,
      status:     'Pending Verification',
    },
  };

  const { data } = await apiClient.post('/orders', backendPayload);
  return { data: data.order };
}

export async function getOrders() {
  if (USE_MOCK) {
    await delay(500);
    return { data: MOCK_ORDERS };
  }
  // Backend returns { count, orders: [...] } with MongoDB field names.
  // Normalise each order to the flat shape the dashboard table expects.
  const { data } = await apiClient.get('/orders');
  const normalised = (data.orders || []).map((o) => ({
    // keep the full raw order for detail views
    ...o,
    // flat fields the OrdersTable renders
    id:       o.orderId || o._id,
    customer: o.customerInfo?.fullName || 'Unknown',
    email:    o.customerInfo?.email    || '',
    phone:    o.customerInfo?.phoneNumber || '',
    product:  o.orderedItem?.productName || o.orderedItem?.selectedColor || '—',
    date:     o.createdAt,
    status:   o.orderStatus || 'Pending',
    // no price stored on the order — use 0 until payment amount is tracked
    total:    o.payment?.amount || 0,
  }));
  return { data: normalised };
}

export async function getOrderById(orderNumber) {
  if (USE_MOCK) {
    await delay(400);
    const order = MOCK_ORDERS.find((o) => o.id === orderNumber);
    if (!order) throw { message: 'Order not found', status: 404 };
    return { data: order };
  }
  const { data } = await apiClient.get(`/orders/${orderNumber}`);
  return { data: data.order };
}
