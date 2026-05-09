const Joi = require('joi');

const patientSchema = Joi.object({
  name: Joi.string().max(100).required(),
  age: Joi.number().min(0).max(120).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  email: Joi.string().email().allow('').optional(),
  department: Joi.string().max(50).required(),
  doctor: Joi.string().max(100).allow('').optional(),
  requiresPayment: Joi.boolean().optional(),
  amount: Joi.number().optional()
});

const tokenSchema = Joi.object({
  tokenId: Joi.string().required()
});

const validatePatient = (req, res, next) => {
  const { error } = patientSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateToken = (req, res, next) => {
  const { error } = tokenSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = { validatePatient, validateToken };