const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'used', 'expired'],
    default: 'pending'
  },
  paymentId: {
    type: String, // Razorpay order ID
    required: false
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
  },
  printedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for fast lookup
tokenSchema.index({ tokenId: 1 });
tokenSchema.index({ status: 1 });

module.exports = mongoose.model('Token', tokenSchema);