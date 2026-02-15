const express = require('express');
const router = express.Router();
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const { protect, authorize } = require('../middleware/authMiddleware');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const upload = multer();

// @desc    Upload evidence
// @route   POST /evidence/upload
// @access  Private (Police, Lawyer)
router.post('/upload', protect, authorize('POLICE', 'LAWYER', 'ADMIN'), upload.single('file'), async (req, res) => {
  const { caseId } = req.body;

  try {
    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
        return res.status(404).json({ message: 'Case not found' });
    }

    // Check if any existing evidence for this case is locked (or if case itself is locked)
    // For simplicity, we can check if there's any locked evidence
    const isLocked = await Evidence.findOne({ caseId, locked: true });
    if (isLocked) {
        return res.status(403).json({ message: 'Evidence locker for this case is locked' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Send file to Evidence Service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post('http://localhost:9000/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const { hash, path: filePath, filename } = response.data;

    const evidence = await Evidence.create({
      caseId,
      uploadedBy: req.user._id,
      fileHash: hash,
      filePath: filename, // We store the filename to fetch it from evidence service
      fileType: req.file.mimetype,
    });

    res.status(201).json(evidence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get evidence for a case
// @route   GET /evidence/:caseId
// @access  Private
router.get('/:caseId', protect, async (req, res) => {
  try {
    const evidence = await Evidence.find({ caseId: req.params.caseId })
      .populate('uploadedBy', 'name role');
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
