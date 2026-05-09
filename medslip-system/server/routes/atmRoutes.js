const express = require('express');
const { validateToken, triggerPrint } = require('../controllers/atmController');
const { validateToken: validateTokenMid } = require('../middleware/validation');

const router = express.Router();

router.post('/validate', validateTokenMid, validateToken);
router.post('/print', validateTokenMid, triggerPrint);

module.exports = router;