const express = require('express');
const {
  createClaim,
  getClaims,
  updateClaimStatus,
} = require('../controllers/claimController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // All claim routes are protected

router
  .route('/')
  .post(createClaim)
  .get(getClaims);

router
  .route('/:id')
  .put(updateClaimStatus);

module.exports = router;
