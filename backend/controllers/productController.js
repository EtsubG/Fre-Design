const Product = require('../models/Product');

// @desc  Get all products (with album populated)
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.albumId) filter.albumId = req.query.albumId;

    const products = await Product.find(filter)
      .populate('albumId', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// @desc  Get single product by ID
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('albumId', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// @desc  Create a new product
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name, description, shortDescription, fabricDetails,
      price, estimatedTailoringTime, deliveryTime,
      badge, isFeatured, albumId, images, colors,
    } = req.body;

    const product = await Product.create({
      name,
      description:            description || shortDescription || '',
      shortDescription:       shortDescription || '',
      fabricDetails:          fabricDetails || '',
      price,
      estimatedTailoringTime: estimatedTailoringTime || '',
      deliveryTime:           deliveryTime || '',
      badge:                  badge || '',
      isFeatured:             isFeatured || false,
      albumId:                albumId || null,
      images:                 images || [],
      colors:                 colors || [],
    });

    const populated = await product.populate('albumId', 'name slug');
    res.status(201).json({ message: 'Product created successfully', product: populated });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// @desc  Update a product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('albumId', 'name slug');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// @desc  Delete a product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
