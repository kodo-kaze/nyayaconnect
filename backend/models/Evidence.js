const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileHash: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  locked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;
