const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Token = require('../models/Token');
const crypto = require('crypto');

const createOrder = async (req, res) => {
  

  try {
    const { tokenId, amount } = req.body; // amount in paise, e.g., 50000 for 500 INR

    const token = await Token.findOne({ tokenId });
    if (!token || token.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid token for payment' });
    }

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `token_${tokenId}`,
      notes: { tokenId }
    };

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    console.log('Creating Razorpay order with options:', options);
    const order = await rzp.orders.create(options);

    // Save pending payment
    const payment = new Payment({
      razorpayOrderId: order.id,
      tokenId: token._id,
      amount: amount / 100, // rupees
      status: 'created'
    });
    await payment.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, tokenId } = req.body;

    // Verify signature
    const sign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (sign !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Fetch and update payment
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    // Update token
    await Token.findOneAndUpdate(
      { tokenId },
      { status: 'paid', paymentId: payment._id }
    );

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

module.exports = { createOrder, verifyPayment };