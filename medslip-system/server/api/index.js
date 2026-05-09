const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const patientRoutes = require('../routes/patientRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const atmRoutes = require('../routes/atmRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/patient', patientRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/atm', atmRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MedSlip API is running on Vercel' });
});

// MongoDB Connection (lazy - connects on first request)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return;
  
  const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI;
  if (!MONGO_URI) {
    console.warn('No MongoDB URI configured - running without database');
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// Connect and export
connectToDatabase();

module.exports = app;