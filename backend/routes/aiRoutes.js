const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');

// @desc    Analyze complaint
// @route   POST /ai/analyzeComplaint
// @access  Private
router.post('/analyzeComplaint', protect, async (req, res) => {
  try {
    const { complaint_text } = req.body;
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/predict-category`, { complaint_text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Service error' });
  }
});

// @desc    Summarize case
// @route   POST /ai/summarizeCase
// @access  Private
router.post('/summarizeCase', protect, async (req, res) => {
  try {
    const { full_case_text } = req.body;
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/summarize`, { full_case_text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Service error' });
  }
});

// @desc    Get deep legal insight
// @route   POST /ai/legalInsight
// @access  Private
router.post('/legalInsight', protect, async (req, res) => {
  try {
    const { complaint_text } = req.body;
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/get-legal-insight`, { complaint_text });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'AI Service error' });
  }
});

module.exports = router;
