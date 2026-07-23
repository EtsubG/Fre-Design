const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// POST /api/upload
// 'receipt' is the field name your friend will use on the frontend form
router.post('/', upload.single('receipt'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file path so the frontend can save it to the Order database
    const fileUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ 
      message: 'Receipt uploaded successfully',
      receiptUrl: fileUrl 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;