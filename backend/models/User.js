const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);