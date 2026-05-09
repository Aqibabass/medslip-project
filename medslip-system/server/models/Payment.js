const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    required: false
  },
  razorpaySignature: {
    type: String,
    required: false
  },
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created'
  },
  paidAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);