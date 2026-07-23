const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// /api/products
router.route('/')
  .get(getProducts)
  .post(protect,createProduct);

// /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(protect,updateProduct)
  .delete(protect,deleteProduct);

module.exports = router;