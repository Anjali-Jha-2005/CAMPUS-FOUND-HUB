const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validate');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
