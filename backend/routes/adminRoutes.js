const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /admin/users
// @access  Private (Admin)
router.get('/users', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign Judge to case (Proxy to case route if needed, or here)
// @route   PUT /admin/assignJudge
// @access  Private (Admin)
router.put('/assignJudge', protect, authorize('ADMIN'), async (req, res) => {
    // Logic can be shared with caseRoutes assign
    res.status(501).json({ message: 'Use /cases/assign/:id instead' });
});

module.exports = router;
