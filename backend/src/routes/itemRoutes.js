const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { validate, schemas } = require('../middlewares/validate');

router
  .route('/')
  .get(getItems)
  .post(protect, upload.single('image'), validate(schemas.item), createItem);

router
  .route('/:id')
  .get(getItem)
  .put(protect, upload.single('image'), validate(schemas.item), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
