const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');
const auditLog = require('../middleware/auditMiddleware');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// 1. REGISTRATION GATES
// Citizen: Self-reg + OTP required for ACTIVE
router.post('/register/citizen', auditLog('CITIZEN_REG'), async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const user = await User.create({
      name, email, phone, password,
      role: 'CITIZEN',
      status: 'PENDING' // Becomes ACTIVE after OTP verify
    });
    // In real app, trigger SMS service here
    user.otp = { code: '123456', expiresAt: Date.now() + 600000 };
    await user.save();
    res.status(201).json({ message: 'OTP sent to phone', userId: user._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Police/Lawyer: Verification required
router.post('/register/official', auditLog('OFFICIAL_REG'), async (req, res) => {
  const { name, email, phone, password, role, badgeID, barCouncilNo, idCardImage } = req.body;
  if (!['POLICE', 'LAWYER'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  try {
    const user = await User.create({
      name, email, phone, password, role,
      badgeID, barCouncilNo, idCardImage,
      status: 'PENDING'
    });
    res.status(201).json({ message: 'Verification request submitted to Admin', userId: user._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 2. LOGIN GATES
router.post('/login', auditLog('LOGIN_ATTEMPT'), async (req, res) => {
  const { email, password, otp, deviceFingerprint } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Role-Specific Login Rules
  switch (user.role) {
    case 'ADMIN':
      return res.json({ token: generateToken(user._id), role: user.role });

    case 'JUDGE':
      if (user.isFirstLogin) return res.status(200).json({ step: 'PWD_RESET', userId: user._id });
      if (!otp) return res.status(200).json({ step: 'OTP_REQUIRED' }); // 2FA Mandatory
      break;

    case 'POLICE':
      if (user.status !== 'ACTIVE') return res.status(403).json({ message: 'Official account not yet approved by Admin' });
      if (!otp) return res.status(200).json({ step: 'OTP_REQUIRED' }); // OTP Mandatory
      break;

    case 'CITIZEN':
      if (user.status !== 'ACTIVE' && !otp) return res.status(200).json({ step: 'VERIFICATION_REQUIRED' });
      break;
  }

  // Handle OTP verification if provided
  if (otp) {
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.status = 'ACTIVE';
    user.otp.isVerified = true;
  }

  // Device Tracking for Officials
  if (['JUDGE', 'POLICE', 'ADMIN'].includes(user.role)) {
    if (deviceFingerprint && !user.deviceFingerprints.includes(deviceFingerprint)) {
      user.deviceFingerprints.push(deviceFingerprint);
    }
  }

  user.lastLogin = Date.now();
  await user.save();

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, role: user.role, status: user.status }
  });
});

module.exports = router;
