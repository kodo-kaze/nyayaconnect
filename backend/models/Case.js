const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const suspectSchema = new mongoose.Schema({
  name: String,
  details: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedAt: { type: Date, default: Date.now }
});

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  caseNumber: { type: String, unique: true, sparse: true },
  registrationDate: Date,
  jurisdiction: String,
  courtroomName: String,
  priorityLevel: { type: String, enum: ['Normal', 'Urgent', 'Emergency'], default: 'Normal' },
  
  complainant: {
    address: String,
    idProofType: String,
    idProofNumber: String,
    relationshipToCase: String
  },
  
  accused: {
    name: String,
    address: String,
    identifiers: String,
    isUnknown: { type: Boolean, default: false }
  },

  // Investigation Specifics
  suspects: [suspectSchema],
  investigationDiary: [diarySchema],
  finalReportPath: String,
  reportSubmittedAt: Date,

  incidentDate: Date,
  incidentTime: String,
  incidentLocation: String,
  hasInjuryDamage: { type: Boolean, default: false },
  
  legalClassification: {
    approvedSections: [String],
    severityLevel: String,
    isBailable: { type: Boolean, default: true }
  },

  status: {
    type: String,
    enum: [
      'PENDING_VERIFICATION', 
      'REGISTERED', 
      'ASSIGNED', 
      'INVESTIGATING', 
      'REPORT_SUBMITTED',
      'TRIAL', 
      'CLOSED', 
      'REJECTED'
    ],
    default: 'PENDING_VERIFICATION',
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedPolice: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedJudge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedLawyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  aiUrgencyScore: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
