const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Case = require('../models/Case');
const { protect, authorize } = require('../middleware/authMiddleware');
const auditLogger = require('../middleware/auditMiddleware');

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

// @desc    Approve or Reject a case
// @route   PUT /admin/approveCase/:id
// @access  Private (Admin)
router.put('/approveCase/:id', protect, authorize('ADMIN'), auditLogger('APPROVE_CASE'), async (req, res) => {
  const { approvalStatus } = req.body;

  if (!['approved', 'rejected'].includes(approvalStatus)) {
    return res.status(400).json({ message: 'Invalid approval status' });
  }

  try {
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.approvalStatus = approvalStatus;
      // If approved, we might want to keep status as 'filed'. If rejected, maybe 'closed'?
      // For now, just update approvalStatus.
      const updatedCase = await caseItem.save();
      res.json(updatedCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
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
