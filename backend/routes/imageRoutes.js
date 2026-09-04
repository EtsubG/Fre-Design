const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadImage');
const cloudinary = require('../config/cloudinary');

// POST /api/images/upload — upload a single product image (protected)
router.post('/upload', protect, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: req.file.path,        // Cloudinary secure URL
      publicId: req.file.filename, // Cloudinary public_id, useful for deletion later
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/images/:publicId — remove an image from Cloudinary (protected)
// publicId will contain slashes (folder path), so pass it URL-encoded from the frontend
router.delete('/:publicId(*)', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.status(200).json({ message: 'Image deleted from Cloudinary' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;