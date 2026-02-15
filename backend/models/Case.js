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
  caseNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  registrationDate: Date,
  jurisdiction: {
    type: String,
  },
  courtroomName: String,
  priorityLevel: {
    type: String,
    enum: ['Normal', 'Urgent', 'Emergency'],
    default: 'Normal'
  },
  // 2. Parties Involved
  complainant: {
    address: String,
    idProofType: String,
    idProofNumber: String,
    relationshipToCase: String
  },
  accused: {
    name: String,
    address: String,
    identifiers: String, // phone, vehicle etc.
    isUnknown: { type: Boolean, default: false }
  },
  // 3. Incident Information
  incidentDate: Date,
  incidentTime: String,
  incidentLocation: String,
  incidentCoordinates: String,
  peopleInvolvedCount: Number,
  hasInjuryDamage: { type: Boolean, default: false },
  // 4. Legal Classification
  legalClassification: {
    suggestedSections: [String],
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
      'SCHEDULED', 
      'INVESTIGATING', 
      'TRIAL', 
      'CLOSED', 
      'REJECTED', 
      'NEED_MORE_INFO',
      'TRANSFERRED'
    ],
    default: 'PENDING_VERIFICATION',
  },
  hearings: [{
    date: Date,
    purpose: String,
    notes: String,
    presence: {
      citizen: Boolean,
      police: Boolean,
      lawyer: Boolean
    }
  }],
  publicProsecutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  aiSuggestions: {
    category: String,
    urgencyScore: Number,
    recommendedDepartment: String
  },
  aiOverrides: {
    category: String,
    urgencyScore: Number,
    reason: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  rejectionReason: String,
  officialNotes: String, // Notes from Police/Judge when updating status or rejecting
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
