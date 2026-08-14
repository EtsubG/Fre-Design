import apiClient from './apiClient';

export async function createOrder(orderPayload) {
  // Map the flat frontend form to the nested shape the backend expects
  const backendPayload = {
    customerInfo: {
      fullName:        orderPayload.fullName        || '',
      phoneNumber:     orderPayload.phone           || '',
      email:           orderPayload.email           || '',
      deliveryAddress: orderPayload.address         || '',
      city:            orderPayload.city            || '',
      country:         orderPayload.country         || '',
      additionalNotes: orderPayload.notes           || '',
    },
    measurements: {
      height:            Number(orderPayload.height)            || 0,
      bust:              Number(orderPayload.bust)              || 0,
      waist:             Number(orderPayload.waist)             || 0,
      hips:              Number(orderPayload.hips)              || 0,
      shoulderWidth:     Number(orderPayload.shoulderWidth)     || 0,
      sleeveLength:      Number(orderPayload.sleeveLength)      || 0,
      dressLength:       Number(orderPayload.dressLength)       || 0,
      waistToFloor:      Number(orderPayload.waistToFloor)      || 0,
      shoulderToWaist:   Number(orderPayload.shoulderToWaist)   || 0,
      armCircumference:  Number(orderPayload.armCircumference)  || 0,
      neckCircumference: Number(orderPayload.neckCircumference) || 0,
    },
    orderedItem: {
      product:       orderPayload.productId    || '',
      productName:   orderPayload.productName  || '',
      selectedColor: orderPayload.fabric       || orderPayload.selectedColor || 'custom',
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
  const { data } = await apiClient.get('/orders');
  const normalised = (data.orders || []).map((o) => ({
    ...o,
    id:       o.orderId || o._id,
    customer: o.customerInfo?.fullName    || 'Unknown',
    email:    o.customerInfo?.email       || '',
    phone:    o.customerInfo?.phoneNumber || '',
    product:  o.orderedItem?.productName  || o.orderedItem?.selectedColor || '—',
    date:     o.createdAt,
    status:   o.orderStatus || 'Pending',
    total:    o.payment?.amount || 0,
  }));
  return { data: normalised };
}

export async function getOrderById(orderNumber) {
  const { data } = await apiClient.get(`/orders/${orderNumber}`);
  return { data: data.order };
}
