const express = require('express');
const router = express.Router();
const AboutPage = require('../models/AboutPage');


router.put('/', async (req, res) => {
  const { experience, tagline, heading, paragraph, stats } = req.body;
  try {
    let aboutPage = await AboutPage.findOne();
    if (aboutPage) {
      aboutPage.experience = experience;
      aboutPage.tagline = tagline;
      aboutPage.heading = heading;
      aboutPage.paragraph = paragraph;
      aboutPage.stats = stats;
      await aboutPage.save();
    } else {
      aboutPage = new AboutPage({ experience, tagline, heading, paragraph, stats });
      await aboutPage.save();
    }
    res.status(200).json({ success: true, data: aboutPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    if (!aboutPage) {
      return res.status(404).json({ success: false, message: 'No about page content found.' });
    }
    res.status(200).json({ success: true, data: aboutPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 