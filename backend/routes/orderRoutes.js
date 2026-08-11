const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// POST /api/orders          — public: submit a new order
// GET  /api/orders          — admin only: list all orders
router.route('/')
  .post(createOrder)
  .get(protect, getOrders);

// GET /api/orders/:id       — public: look up an order by orderId or _id
router.get('/:id', getOrderById);

// PUT /api/orders/:id/status — admin only: update order status
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
