const Token = require('../models/Token');
const Patient = require('../models/Patient');

const validateToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const token = await Token.findOne({ tokenId })
      .populate('patientId', 'name age gender department doctor phone')
      .populate('paymentId', 'razorpayPaymentId');

    if (!token) {
      return res.status(404).json({ error: 'Invalid token - not found in system' });
    }

    if (token.status === 'used') {
      return res.status(400).json({ error: 'Token already used. Cannot print again.' });
    }

    if (token.status === 'expired') {
      return res.status(400).json({ error: 'Token has expired. Please generate a new one.' });
    }

    if (token.status === 'pending') {
      return res.status(400).json({ error: 'Payment required before printing. Please complete payment first.' });
    }

    // Valid token: mark it as used and set printed time
    token.status = 'used';
    token.printedAt = new Date();
    await token.save();

    const patient = token.patientId;

    res.json({
      success: true,
      message: 'Token validated successfully. Ready to print.',
      slipData: {
        hospitalName: process.env.HOSPITAL_NAME || 'MedSlip Hospital',
        tokenId: token.tokenId,
        patientName: patient.name,
        age: patient.age,
        gender: patient.gender,
        department: patient.department,
        doctor: patient.doctor || 'Assigned Doctor',
        phone: patient.phone,
        generatedAt: token.generatedAt,
        printedAt: token.printedAt,
        paymentId: token.paymentId?.razorpayPaymentId || null
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Token validation failed. Please try again.' });
  }
};

const triggerPrint = async (req, res) => {
  try {
    const { tokenId } = req.body;

    // Validate token first
    const token = await Token.findOne({ tokenId })
      .populate('patientId', 'name age gender department doctor phone')
      .populate('paymentId', 'razorpayPaymentId');

    if (!token) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    if (token.status === 'used') {
      return res.status(400).json({ error: 'Token already printed' });
    }

    if (token.status === 'pending') {
      return res.status(400).json({ error: 'Payment required' });
    }

    // Mark as used
    token.status = 'used';
    token.printedAt = new Date();
    await token.save();

    res.json({
      success: true,
      message: 'Print triggered successfully',
      slipData: {
        hospitalName: process.env.HOSPITAL_NAME || 'MedSlip Hospital',
        tokenId: token.tokenId,
        patientName: token.patientId.name,
        age: token.patientId.age,
        gender: token.patientId.gender,
        department: token.patientId.department,
        doctor: token.patientId.doctor || 'Assigned Doctor',
        phone: token.patientId.phone,
        generatedAt: token.generatedAt,
        printedAt: token.printedAt,
        paymentId: token.paymentId?.razorpayPaymentId || null
      }
    });
  } catch (error) {
    console.error('Print trigger error:', error);
    res.status(500).json({ error: 'Print trigger failed' });
  }
};

module.exports = { validateToken, triggerPrint };