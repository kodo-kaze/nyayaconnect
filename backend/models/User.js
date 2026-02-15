const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['CITIZEN', 'POLICE', 'LAWYER', 'JUDGE', 'ADMIN'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'], 
    default: 'PENDING' 
  },
  
  // Official Role Identifiers
  badgeID: { type: String, sparse: true }, // Police
  barCouncilNo: { type: String, sparse: true }, // Lawyer
  idCardImage: { type: String }, // URL/Path to verification image
  
  // Verification & Security
  isFirstLogin: { type: Boolean, default: true }, // For Judges/Officials
  otp: {
    code: String,
    expiresAt: Date,
    isVerified: { type: Boolean, default: false }
  },
  
  // Tracking
  deviceFingerprints: [String],
  lastLogin: Date,
  
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
