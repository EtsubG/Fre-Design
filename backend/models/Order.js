const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Unique ID for customer tracking
  
  customerInfo: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    deliveryAddress: { type: String, required: true },
    city: { type: String, required: true },
    additionalNotes: { type: String }
  },

  // Custom Measurements
  measurements: {
    height:          { type: Number, required: true },
    waist:           { type: Number, required: true },
    hips:            { type: Number, required: true },
    shoulderWidth:   { type: Number, required: true },
    sleeveLength:    { type: Number, required: true },
    dressLength:     { type: Number, required: true },
    waistToFloor:    { type: Number, default: 0 },   // collected optionally
    shoulderToWaist: { type: Number, default: 0 }    // collected optionally
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