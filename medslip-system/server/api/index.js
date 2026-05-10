const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const patientRoutes = require('../routes/patientRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const atmRoutes = require('../routes/atmRoutes');

const app = express();

// CORS
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MedSlip API running on Vercel' });
});

app.use('/api/patient', patientRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/atm', atmRoutes);

// MongoDB Connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const uri = process.env.MONGO_URI || process.env.DB_URI;
  if (!uri) {
    console.warn('No MongoDB URI configured');
    return null;
  }
  try {
    await mongoose.connect(uri);
    cachedDb = mongoose.connection;
    console.log('MongoDB connected');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return null;
  }
}

// Wrap handler to connect DB on each request
const handler = async (req, res) => {
  await connectDB();
  return app(req, res);
};

module.exports = handler;