const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fabricDetails: { type: String, required: true },
  price: { type: Number, required: true },
  shortDescription: { type: String, required: true },
  estimatedTailoringTime: { type: String, required: true }, // e.g., "2-3 Weeks"
  
  // Array of image URLs (we'll use Cloudinary or similar for hosting)
  images: [{ type: String }], 
  
  // Available colors with their specific preview image/swatch
  colors: [{
    colorName: { type: String, required: true },
    hexCode: { type: String }, 
    colorImagePreview: { type: String } // Thumbnail preview for this color
  }],
  
  isFeatured: { type: Boolean, default: false } // For the "New Arrivals/Hero" section
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);