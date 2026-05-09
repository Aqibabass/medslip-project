const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Invalid phone number']
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email']
  },
  department: {
    type: String,
    required: true,
    maxlength: 50
  },
  doctor: {
    type: String,
    required: false,
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);