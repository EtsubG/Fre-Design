const Order = require('../models/Order');
const sendTelegramNotification = require('../utils/telegram');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customerInfo, measurements, orderedItem, payment } = req.body;

    // Validation: Ensure the required top-level objects exist
    if (!customerInfo || !measurements || !orderedItem || !payment) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    // Generate a unique Order ID (e.g., HAB-1691234567)
    const generateOrderId = `HAB-${Date.now().toString().slice(-6)}`;

    // Create the order in memory
    const order = new Order({
      orderId: generateOrderId,
      customerInfo,
      measurements,
      orderedItem,
      payment,
      orderStatus: 'Pending'
    });

    // Save to MongoDB
    const createdOrder = await order.save();

    // Trigger Telegram notification to the designer (non-blocking)
    sendTelegramNotification(createdOrder);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: createdOrder.orderId,
      order: createdOrder
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: 'Server error while creating order', error: error.message });
  }
};

// @desc    Get single order by orderId string (e.g. HAB-123456)
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    // Try orderId field first, fall back to MongoDB _id
    let order = await Order.findOne({ orderId: req.params.id });
    if (!order) order = await Order.findById(req.params.id).catch(() => null);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders for Admin Dashboard
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    // Fetch all orders, pull full product info via populate, and show newest first
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Pending', 'Tailoring', 'Ready for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createOrder,
  getOrderById,
  getOrders, 
  updateOrderStatus 
};