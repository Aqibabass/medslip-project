const express = require('express');
const { createPatient, getTokenDetails } = require('../controllers/patientController');
const { validatePatient, validateToken } = require('../middleware/validation');

const router = express.Router();

router.post('/create', validatePatient, createPatient);
router.post('/token-details', validateToken, getTokenDetails);

module.exports = router;