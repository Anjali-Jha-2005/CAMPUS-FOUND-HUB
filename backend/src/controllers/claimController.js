const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const sendEmail = require('../services/mailService');

// @desc    Create a claim for an item
// @route   POST /api/v1/claims
// @access  Private
exports.createClaim = asyncHandler(async (req, res, next) => {
  const { itemId, message } = req.body;

  const item = await Item.findById(itemId).populate('user');

  if (!item) {
    return next(new ErrorResponse(`Item not found with id of ${itemId}`, 404));
  }

  if (item.status === 'resolved') {
    return next(new ErrorResponse(`Item is already resolved`, 400));
  }

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user.id,
    message,
  });

  // Notify item owner via email
  try {
    await sendEmail({
      email: item.user.email,
      subject: 'New Claim Request - Campus Found Hub',
      message: `Hello ${item.user.name},\n\nSomeone has claimed the item: "${item.title}".\n\nClaimant Message: "${message}"\n\nPlease log in to the portal to accept or reject this claim.\n\nBest regards,\nCampus Found Hub Team`,
    });
  } catch (err) {
    console.error(`Email could not be sent: ${err.message}`);
  }

  res.status(201).json({
    success: true,
    data: claim,
  });
});

// @desc    Get all claims (Admin: all, User: their claims or claims on their items)
// @route   GET /api/v1/claims
// @access  Private
exports.getClaims = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'admin') {
    query = Claim.find().populate('item claimant');
  } else {
    // Finds claims made by the user OR claims on items owned by the user
    const userItems = await Item.find({ user: req.user.id }).select('_id');
    const userItemIds = userItems.map(item => item._id);

    query = Claim.find({
      $or: [
        { claimant: req.user.id },
        { item: { $in: userItemIds } }
      ]
    }).populate('item claimant');
  }

  const claims = await query;

  res.status(200).json({
    success: true,
    count: claims.length,
    data: claims,
  });
});

// @desc    Update claim status (Accept/Reject)
// @route   PUT /api/v1/claims/:id
// @access  Private
exports.updateClaimStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const claim = await Claim.findById(req.params.id).populate('item claimant');

  if (!claim) {
    return next(new ErrorResponse(`Claim not found with id of ${req.params.id}`, 404));
  }

  const item = await Item.findById(claim.item._id);

  // Only the item owner or admin can update claim status
  if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this claim`, 401));
  }

  claim.status = status;
  await claim.save();

  // If accepted, mark item as resolved
  if (status === 'accepted') {
    item.status = 'resolved';
    await item.save();
  }

  // Notify claimant via email
  try {
    await sendEmail({
      email: claim.claimant.email,
      subject: `Claim Request ${status.toUpperCase()} - Campus Found Hub`,
      message: `Hello ${claim.claimant.name},\n\nYour claim for the item "${item.title}" has been ${status}.\n\nThank you for using Campus Found Hub.`,
    });
  } catch (err) {
    console.error(`Email could not be sent: ${err.message}`);
  }

  res.status(200).json({
    success: true,
    data: claim,
  });
});
