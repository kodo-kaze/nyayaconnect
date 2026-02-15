const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auditLog = require('../middleware/auditMiddleware');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Helper: Generate Random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. REGISTRATION
router.post('/register/citizen', auditLog('CITIZEN_REG'), async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const otpCode = generateOTP();
    const user = await User.create({
      name, email, phone, password,
      role: 'CITIZEN',
      status: 'PENDING',
      otp: { code: otpCode, expiresAt: Date.now() + 600000 }
    });
    
    console.log(`[SMS Simulation] OTP for ${phone}: ${otpCode}`);
    res.status(201).json({ message: 'OTP sent to phone', userId: user._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.post('/register/official', auditLog('OFFICIAL_REG'), async (req, res) => {
  const { name, email, phone, password, role, badgeID, barCouncilNo, idCardImage } = req.body;
  if (!['POLICE', 'LAWYER'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  try {
    const user = await User.create({
      name, email, phone, password, role,
      badgeID, barCouncilNo, idCardImage,
      status: 'PENDING'
    });
    res.status(201).json({ message: 'Verification request submitted', userId: user._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 2. OTP RESEND
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otpCode = generateOTP();
  user.otp = { code: otpCode, expiresAt: Date.now() + 600000, isVerified: false };
  await user.save();

  console.log(`[SMS Simulation] Resent OTP for ${user.phone}: ${otpCode}`);
  res.json({ message: 'New OTP sent successfully' });
});

// 3. UNIFIED LOGIN GATE
router.post('/login', auditLog('LOGIN_ATTEMPT'), async (req, res) => {
  const { email, password, otp, deviceFingerprint } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if OTP is being submitted
  if (otp) {
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.status = 'ACTIVE'; // Verify account if it was pending
    user.otp.isVerified = true;
    // Don't save yet, continue to token generation
  } else {
    // Determine if OTP is REQUIRED
    let otpNeeded = false;
    let step = 'OTP_REQUIRED';

    if (user.role === 'CITIZEN' && user.status === 'PENDING') {
      otpNeeded = true;
      step = 'VERIFICATION_REQUIRED';
    } else if (['POLICE', 'JUDGE', 'ADMIN'].includes(user.role)) {
      if (user.role === 'POLICE' && user.status !== 'ACTIVE') {
        return res.status(403).json({ message: 'Account pending admin approval' });
      }
      if (user.role === 'JUDGE' && user.isFirstLogin) {
        return res.json({ step: 'PWD_RESET', userId: user._id });
      }
      otpNeeded = true;
    }

    if (otpNeeded) {
      const otpCode = generateOTP();
      user.otp = { code: otpCode, expiresAt: Date.now() + 600000, isVerified: false };
      await user.save();
      console.log(`[SMS Simulation] Login OTP for ${user.name}: ${otpCode}`);
      return res.json({ step });
    }
  }

  // Device tracking
  if (['JUDGE', 'POLICE', 'ADMIN'].includes(user.role) && deviceFingerprint) {
    if (!user.deviceFingerprints.includes(deviceFingerprint)) {
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
