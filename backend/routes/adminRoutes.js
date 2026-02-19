const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Case = require('../models/Case');
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/authMiddleware');
const auditLog = require('../middleware/auditMiddleware');
const { generateCaseReport } = require('../utils/pdfGenerator');

// 1. USER MANAGEMENT
// @desc    Create Judge Account (Admin Only)
router.post('/users/create-judge', protect, authorize('ADMIN'), auditLog('CREATE_JUDGE_ACCOUNT'), async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) return res.status(400).json({ message: 'User with this email/phone already exists' });

    const judge = await User.create({
      name, email, phone, password,
      role: 'JUDGE',
      status: 'ACTIVE',
      isFirstLogin: true // Forces password reset on first login
    });

    res.status(201).json({ message: 'Judge account created successfully', id: judge._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// @desc    Get all users for management
router.get('/users', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user account status (Approve/Suspend)
router.put('/users/status/:id', protect, authorize('ADMIN'), auditLog('UPDATE_USER_STATUS'), async (req, res) => {
  const { status, isActive } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (status !== undefined) user.status = status;
    if (isActive !== undefined) user.isActive = isActive;
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. COMPLAINT VERIFICATION
// @desc    Verify complaint (Approve/Reject/NeedInfo)
router.put('/verifyCase/:id', protect, authorize('ADMIN'), auditLog('VERIFY_CASE'), async (req, res) => {
  const { action, reason, jurisdiction, courtroomName, priorityLevel, legalClassification, accused, complainant, incident } = req.body;
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });

    if (action === 'APPROVE') {
      caseItem.status = 'REGISTERED';
      caseItem.caseNumber = `CN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      caseItem.registrationDate = new Date();
      caseItem.jurisdiction = jurisdiction;
      caseItem.courtroomName = courtroomName;
      caseItem.priorityLevel = priorityLevel || 'Normal';
      caseItem.legalClassification = legalClassification;
      caseItem.accused = accused;
      caseItem.complainant = complainant;
      
      if (incident) {
          caseItem.incidentDate = incident.date;
          caseItem.incidentTime = incident.time;
          caseItem.incidentLocation = incident.location;
      }
    } else if (action === 'REJECT') {
      caseItem.status = 'REJECTED';
      caseItem.rejectionReason = reason;
    }

    await caseItem.save();
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Download Case Registration Report (PDF)
router.get('/report/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id)
            .populate('createdBy', 'name phone')
            .populate('assignedPolice', 'name')
            .populate('assignedJudge', 'name');

        if (!caseItem) return res.status(404).json({ message: 'Case not found' });

        const Evidence = require('../models/Evidence');
        const evidence = await Evidence.find({ caseId: caseItem._id });
        
        const caseData = caseItem.toObject();
        caseData.evidence = evidence;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Case_Report_${caseItem.caseNumber}.pdf`);

        generateCaseReport(caseData, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. CASE ASSIGNMENT
router.put('/assign/:id', protect, authorize('ADMIN'), auditLog('ASSIGN_AUTHORITIES'), async (req, res) => {
    const { assignedPolice, assignedJudge, publicProsecutor } = req.body;
    try {
      const caseItem = await Case.findById(req.params.id);
      if (!caseItem) return res.status(404).json({ message: 'Case not found' });
  
      caseItem.assignedPolice = assignedPolice || caseItem.assignedPolice;
      caseItem.assignedJudge = assignedJudge || caseItem.assignedJudge;
      if (publicProsecutor) caseItem.publicProsecutor = publicProsecutor;
      
      if (caseItem.assignedPolice && caseItem.assignedJudge) {
          caseItem.status = 'ASSIGNED';
      }

      await caseItem.save();
      res.json(caseItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// 4. WORKLOAD MONITORING
router.get('/workload', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const officials = await User.find({ role: { $in: ['POLICE', 'JUDGE'] } }).select('name role');
        const workload = await Promise.all(officials.map(async (off) => {
            const query = off.role === 'POLICE' ? { assignedPolice: off._id } : { assignedJudge: off._id };
            const activeStatuses = ['REGISTERED', 'ASSIGNED', 'SCHEDULED', 'INVESTIGATING', 'TRIAL', 'NEED_MORE_INFO'];
            const activeCases = await Case.find({ ...query, status: { $in: activeStatuses } });
            
            let hearingCount = 0;
            if (off.role === 'JUDGE') {
                activeCases.forEach(c => {
                    if (c.hearings) {
                        hearingCount += c.hearings.filter(h => h.date && new Date(h.date) >= new Date()).length;
                    }
                });
            }

            return {
                id: off._id,
                name: off.name,
                role: off.role,
                caseCount: activeCases.length,
                upcomingHearings: hearingCount,
                cases: activeCases.map(c => ({ id: c._id, title: c.title, caseNumber: c.caseNumber }))
            };
        }));
        res.json(workload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. AI AUTO-ASSIGN
router.put('/autoAssign/:id', protect, authorize('ADMIN'), auditLog('AI_AUTO_ASSIGN'), async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) return res.status(404).json({ message: 'Case not found' });

        const getLeastBusy = async (role) => {
            const officials = await User.find({ role, status: 'ACTIVE' });
            let bestMatch = null;
            let minWork = Infinity;
            const activeStatuses = ['REGISTERED', 'ASSIGNED', 'SCHEDULED', 'INVESTIGATING', 'TRIAL', 'NEED_MORE_INFO'];

            for (const off of officials) {
                const count = await Case.countDocuments({ 
                    [role === 'POLICE' ? 'assignedPolice' : 'assignedJudge']: off._id,
                    status: { $in: activeStatuses }
                });
                if (count < minWork) {
                    minWork = count;
                    bestMatch = off._id;
                }
            }
            return bestMatch;
        };

        caseItem.assignedPolice = await getLeastBusy('POLICE');
        caseItem.assignedJudge = await getLeastBusy('JUDGE');
        if (caseItem.assignedPolice && caseItem.assignedJudge) caseItem.status = 'ASSIGNED';

        await caseItem.save();
        res.json(caseItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. AI OVERRIDE
router.put('/aiOverride/:id', protect, authorize('ADMIN'), auditLog('AI_OVERRIDE'), async (req, res) => {
    const { category, urgencyScore, reason } = req.body;
    try {
      const caseItem = await Case.findById(req.params.id);
      if (!caseItem) return res.status(404).json({ message: 'Case not found' });
  
      caseItem.category = category;
      await caseItem.save();
      res.json(caseItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// 7. AUDIT LOGS
router.get('/logs', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const logs = await Log.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
