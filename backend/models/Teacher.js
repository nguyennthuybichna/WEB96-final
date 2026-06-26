const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  isGraduated: {
    type: Boolean,
    default: false
  }
});

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  teacherPositionsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherPosition'
  }],
  degrees: [degreeSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
