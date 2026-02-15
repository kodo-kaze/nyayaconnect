const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileHash: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String },
  relevance: { 
    type: String, 
    enum: ['CRITICAL', 'SUPPORTING', 'BACKGROUND', 'UNSPECIFIED'],
    default: 'UNSPECIFIED'
  },
  locked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
