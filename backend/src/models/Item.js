const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if the item was lost or found'],
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
  },
  contact: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);
