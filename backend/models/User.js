const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  identity: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    required: true,
    default: 'TEACHER'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
