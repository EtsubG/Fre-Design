const multer = require('multer');
const path = require('path');

// 1. Tell Multer where to save files locally (for now)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Will save in a folder named 'uploads'
  },
  filename: (req, file, cb) => {
    // Renames file to prevent overwriting (e.g., 1691234567-receipt.pdf)
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

// 2. Set strict rules for file types (PNG, JPG, PDF)
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedFileTypes = /jpeg|jpg|png|pdf/;
  
  // Check the extension and the MIME type sent by the browser
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only PNG, JPG, and PDF files are allowed for receipts!'));
  }
};

// 3. Initialize the middleware with a 5MB size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;