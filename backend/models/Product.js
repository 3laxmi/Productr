const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  exchangeEligible: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);