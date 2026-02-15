const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['CITIZEN', 'POLICE', 'LAWYER', 'JUDGE', 'ADMIN'],
    default: 'CITIZEN',
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  accountStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'SUSPENDED'],
    default: 'APPROVED', // Defaulting to APPROVED for existing/citizen logic, but will be PENDING for new police/lawyers
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
