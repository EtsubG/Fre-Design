const express = require('express');
const router = express.Router();
const{protect}=require('../middlewares/authMiddleware');

const { 
  createOrder, 
  getOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

// Handles GET /api/orders and POST /api/orders
router.route('/')
  .post(createOrder)
  .get(protect,getOrders);

// Handles PUT /api/orders/:id/status
router.put('/:id/status', protect,updateOrderStatus);

module.exports = router;