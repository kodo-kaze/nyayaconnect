const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { protect, authorize } = require('../middleware/authMiddleware');
const auditLogger = require('../middleware/auditMiddleware');

// @desc    Create a new case
// @route   POST /cases/create
// @access  Private (Citizen)
router.post('/create', protect, authorize('CITIZEN', 'ADMIN'), auditLogger('CREATE_CASE'), async (req, res) => {
  const { 
    title, 
    description, 
    category, 
    aiUrgencyScore,
    incident,
    accused,
    complainant
  } = req.body;

  try {
    const newCase = await Case.create({
      title,
      description,
      createdBy: req.user._id,
      category,
      aiUrgencyScore,
      incidentDate: incident?.date,
      incidentTime: incident?.time,
      incidentLocation: incident?.location,
      peopleInvolvedCount: incident?.peopleCount,
      hasInjuryDamage: incident?.hasInjury,
      accused: {
        name: accused?.name,
        address: accused?.address,
        identifiers: accused?.identifiers,
        isUnknown: accused?.isUnknown
      },
      complainant: {
        address: complainant?.address,
        idProofType: complainant?.idProofType,
        idProofNumber: complainant?.idProofNumber,
        relationshipToCase: complainant?.relationship
      },
      aiSuggestions: {
          category: category,
          urgencyScore: aiUrgencyScore,
          recommendedDepartment: category
      },
      status: 'PENDING_VERIFICATION'
    });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all cases for the logged in user
// @route   GET /cases/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    let query = {};
    const role = req.user.role;

    if (role === 'CITIZEN') {
      query = { createdBy: req.user._id };
    } else if (role === 'POLICE') {
      // Police see cases assigned to them that are beyond verification
      query = { assignedPolice: req.user._id, status: { $nin: ['PENDING_VERIFICATION', 'REJECTED'] } };
    } else if (role === 'LAWYER') {
      query = { assignedLawyers: req.user._id, status: { $nin: ['PENDING_VERIFICATION', 'REJECTED'] } };
    } else if (role === 'JUDGE') {
      query = { assignedJudge: req.user._id, status: { $ne: 'REJECTED' } };
    } else if (role === 'ADMIN') {
      query = {}; // Admin can see all
    }

    const cases = await Case.find(query)
      .populate('createdBy', 'name email phone')
      .populate('assignedPolice', 'name email')
      .populate('assignedJudge', 'name email');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get case by ID
// @route   GET /cases/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedPolice', 'name email')
      .populate('assignedJudge', 'name email')
      .populate('assignedLawyers', 'name email');

    if (caseItem) {
      res.json(caseItem);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    console.error('Error fetching case by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update case status
// @route   PUT /cases/status/:id
// @access  Private (Police, Judge, Admin)
router.put('/status/:id', protect, authorize('POLICE', 'JUDGE', 'ADMIN'), auditLogger('UPDATE_STATUS'), async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.status = req.body.status || caseItem.status;
      if (req.body.officialNotes) {
          caseItem.officialNotes = req.body.officialNotes;
      }
      if (req.body.status === 'REJECTED') {
          caseItem.rejectedBy = req.user._id;
          caseItem.rejectionReason = req.body.officialNotes;
      }
      const updatedCase = await caseItem.save();
      res.json(updatedCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign personnel to case
// @route   PUT /cases/assign/:id
// @access  Private (Admin)
router.put('/assign/:id', protect, authorize('ADMIN'), async (req, res) => {
  const { assignedPolice, assignedJudge, assignedLawyers } = req.body;
  try {
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      if (assignedPolice !== undefined) {
        caseItem.assignedPolice = assignedPolice || null;
      }
      if (assignedJudge !== undefined) {
        caseItem.assignedJudge = assignedJudge || null;
      }
      if (assignedLawyers !== undefined) {
        caseItem.assignedLawyers = assignedLawyers;
      }
      
      const updatedCase = await caseItem.save();
      res.json(updatedCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
