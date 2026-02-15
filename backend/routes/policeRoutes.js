const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');
const auditLog = require('../middleware/auditMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');

// Middleware: Verify Case Assignment
const checkAssignment = async (req, res, next) => {
  const caseItem = await Case.findById(req.params.id);
  if (!caseItem) return res.status(404).json({ message: 'Case not found' });
  if (caseItem.assignedPolice?.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized: You are not the assigned officer for this case' });
  }
  req.caseItem = caseItem;
  next();
};

// 1. Investigation Diary - Immutable Entry
router.post('/:id/diary', protect, authorize('POLICE'), checkAssignment, auditLog('ADD_DIARY_ENTRY'), async (req, res) => {
  const { note } = req.body;
  try {
    req.caseItem.investigationDiary.push({
      officerId: req.user._id,
      note,
      timestamp: new Date()
    });
    await req.caseItem.save();
    res.json({ message: 'Diary entry recorded' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 2. Suspect Management
router.post('/:id/suspects', protect, authorize('POLICE'), checkAssignment, auditLog('ADD_SUSPECT'), async (req, res) => {
  const { name, details } = req.body;
  try {
    req.caseItem.suspects.push({
      name,
      details,
      addedBy: req.user._id
    });
    await req.caseItem.save();
    res.json({ message: 'Suspect added to case file' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 3. Mark Evidence Relevance
router.put('/:id/evidence/:evidenceId', protect, authorize('POLICE'), checkAssignment, auditLog('MARK_EVIDENCE'), async (req, res) => {
  const { relevance } = req.body;
  try {
    const evidence = await Evidence.findById(req.params.evidenceId);
    if (!evidence) return res.status(404).json({ message: 'Evidence not found' });
    
    evidence.relevance = relevance;
    await evidence.save();
    res.json({ message: 'Evidence relevance updated' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 4. Progress Management (REGISTERED -> INVESTIGATING -> REPORT_SUBMITTED)
router.put('/:id/status', protect, authorize('POLICE'), checkAssignment, auditLog('UPDATE_INVESTIGATION_STATUS'), async (req, res) => {
  const { status } = req.body;
  const allowed = ['INVESTIGATING', 'REPORT_SUBMITTED'];
  
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status transition for Police' });
  
  try {
    req.caseItem.status = status;
    if (status === 'REPORT_SUBMITTED') {
      req.caseItem.reportSubmittedAt = new Date();
    }
    await req.caseItem.save();
    res.json({ message: `Case status updated to ${status}` });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
