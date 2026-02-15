const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    enum: ['filed', 'investigating', 'trial', 'closed'],
    default: 'filed',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedPolice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedJudge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedLawyers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  aiSummary: {
    type: String,
  },
  aiUrgencyScore: {
    type: Number,
  },
}, {
  timestamps: true,
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
