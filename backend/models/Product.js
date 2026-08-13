const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:                   { type: String, required: true },
  description:            { type: String, default: '' },
  shortDescription:       { type: String, default: '' },
  fabricDetails:          { type: String, default: '' },
  price:                  { type: Number, required: true },
  estimatedTailoringTime: { type: String, default: '' },
  deliveryTime:           { type: String, default: '' },
  badge:                  { type: String, default: '' },
  isFeatured:             { type: Boolean, default: false },

  // Album this product belongs to
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null,
  },

  // Array of image URLs (uploaded via /api/upload/image)
  images: [{ type: String }],

  // Available colors with optional swatch
  colors: [{
    colorName:         { type: String, required: true },
    hexCode:           { type: String },
    colorImagePreview: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
