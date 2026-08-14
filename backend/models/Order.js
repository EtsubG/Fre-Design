const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Unique ID for customer tracking
  
  customerInfo: {
    fullName:        { type: String, required: true },
    phoneNumber:     { type: String, required: true },
    email:           { type: String, default: '' },
    deliveryAddress: { type: String, default: '' },
    city:            { type: String, default: '' },
    country:         { type: String, default: '' },
    additionalNotes: { type: String, default: '' },
  },

  // Custom Measurements (all in cm, all optional — only height/waist/hips required)
  measurements: {
    height:          { type: Number, default: 0 },
    bust:            { type: Number, default: 0 },
    waist:           { type: Number, default: 0 },
    hips:            { type: Number, default: 0 },
    shoulderWidth:   { type: Number, default: 0 },
    sleeveLength:    { type: Number, default: 0 },
    dressLength:     { type: Number, default: 0 },
    waistToFloor:    { type: Number, default: 0 },
    shoulderToWaist: { type: Number, default: 0 },
    armCircumference:  { type: Number, default: 0 },
    neckCircumference: { type: Number, default: 0 },
  },

  // Product Details
  orderedItem: {
    product:       { type: String },  // MongoDB product ID stored as plain string
    productName:   { type: String },  // human-readable name for easy reference
    selectedColor: { type: String, required: true }
  },

  // Payment Details
  payment: {
    receiptUrl: { type: String, default: 'pending' },
    amount:     { type: Number, default: 0 },           // order price in USD
    status: {
      type: String,
      enum: ['Pending Verification', 'Verified', 'Rejected'],
      default: 'Pending Verification'
    }
  },

  // Admin Tracking
  orderStatus: {
    type: String,
    enum: ['Pending', 'Tailoring', 'Ready for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);