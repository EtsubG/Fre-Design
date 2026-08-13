const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadImage');

// POST /api/images/upload  — upload a single product image (protected)
router.post('/upload', protect, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Return a publicly accessible URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    res.status(200).json({ message: 'Image uploaded successfully', url: imageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
