const Patient = require('../models/Patient');
const { generateUniqueToken } = require('../utils/tokenGenerator');
const Token = require('../models/Token');

const createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, department, doctor, requiresPayment } = req.body;

    // Create patient
    console.log('Creating patient with data:', req.body);
    const patient = new Patient({ name, age, gender, phone, email, department, doctor });
    await patient.save();

    // Generate token
    const tokenId = await generateUniqueToken();
    const token = new Token({
      tokenId,
      patientId: patient._id,
      status: !requiresPayment ? 'paid' : 'pending'
    });
    await token.save();

    res.status(201).json({
      success: true,
      patientId: patient._id,
      tokenId,
      message: 'Patient and token created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create patient/token' });
  }
};

const getTokenDetails = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const token = await Token.findOne({ tokenId })
      .populate('patientId', 'name age gender department doctor')
      .populate('paymentId', 'razorpayPaymentId')
      .select('-__v');

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    if (token.status === 'expired' || token.expiresAt < new Date()) {
      await Token.findByIdAndUpdate(token._id, { status: 'expired' });
      return res.status(400).json({ error: 'Token expired' });
    }

    res.json({
      success: true,
      token,
      requiresPayment: token.status === 'pending' // Assume some depts require pay; config later
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token' });
  }
};

module.exports = { createPatient, getTokenDetails };