const mongoose = require('mongoose');

const perfumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  notes: {
    top: { type: String, required: true },
    heart: { type: String, required: true },
    base: { type: String, required: true }
  },
  longevity: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  sillage: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  rating: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Perfume', perfumeSchema);
