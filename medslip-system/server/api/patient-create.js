const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Token = require('../models/Token');
const { generateUniqueToken } = require('../utils/tokenGenerator');

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return;
  const uri = process.env.MONGO_URI || process.env.DB_URI;
  if (!uri) {
    console.warn('No MongoDB URI configured');
    return;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = mongoose.connection;
  } catch (err) {
    console.error('MongoDB error:', err.message);
  }
}

module.exports = async (req, res) => {
  await connectDB();
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, age, gender, phone, email, department, doctor, requiresPayment } = req.body;
    
    if (!name || !age || !gender || !phone || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const patient = new Patient({ name, age, gender, phone, email, department, doctor });
    await patient.save();

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