const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
  },
  ipAddress: {
    type: String,
  },
}, {
  timestamps: true,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
