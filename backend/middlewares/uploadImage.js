const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fere-design/products', // organizes uploads in a Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Optional: auto-resize/optimize on upload
    transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const mime = allowed.test(file.mimetype);
  if (mime) return cb(null, true);
  cb(new Error('Only JPG, PNG, and WebP images are allowed'));
};

const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = uploadImage;