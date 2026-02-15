const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g., 'LOGIN_ATTEMPT', 'OTP_VERIFY', 'STATUS_CHANGE'
  role: String,
  status: { type: String, enum: ['SUCCESS', 'FAILURE', 'PENDING'] },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  deviceFingerprint: String
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
