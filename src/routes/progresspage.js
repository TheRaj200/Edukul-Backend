const express = require('express');
const router = express.Router();
const ProgressPage = require('../models/ProgressPage');

// Update or create ProgressPage content
router.put('/', async (req, res) => {
  const { tagline, heading, subheading, bars } = req.body;
  try {
    let progressPage = await ProgressPage.findOne();
    if (progressPage) {
      progressPage.tagline = tagline;
      progressPage.heading = heading;
      progressPage.subheading = subheading;
      progressPage.bars = bars;
      await progressPage.save();
    } else {
      progressPage = new ProgressPage({ tagline, heading, subheading, bars });
      await progressPage.save();
    }
    res.status(200).json({ success: true, data: progressPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ProgressPage content
router.get('/', async (req, res) => {
  try {
    const progressPage = await ProgressPage.findOne();
    if (!progressPage) {
      return res.status(404).json({ success: false, message: 'No progress page content found.' });
    }
    res.status(200).json({ success: true, data: progressPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 