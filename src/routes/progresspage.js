const express = require('express');
const router = express.Router();
const ProgressPage = require('../models/ProgressPage');


router.put('/', async (req, res) => {
  const { tagline,  progressItems } = req.body;
  try {
    let progressPage = await ProgressPage.findOne();
    if (progressPage) {
      progressPage.tagline = tagline;
      progressPage.progressItems = progressItems;
      await progressPage.save();
    } else {
      progressPage = new ProgressPage({ tagline, progressItems });
      await progressPage.save();
    }
    res.status(200).json({ success: true, data: progressPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


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