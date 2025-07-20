const express = require('express');
const router = express.Router();
const HomePage = require('../models/HomePage');

// Update or create HomePage content
router.put('/', async (req, res) => {
  const { heading, paragraph, buttonText } = req.body;
  try {
    let homePage = await HomePage.findOne();
    if (homePage) {
      // Update existing document
      homePage.heading = heading;
      homePage.paragraph = paragraph;
      homePage.buttonText = buttonText;
      await homePage.save();
    } else {
      // Create new document
      homePage = new HomePage({ heading, paragraph, buttonText });
      await homePage.save();
    }
    res.status(200).json({ success: true, data: homePage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get HomePage content
router.get('/', async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ success: false, message: 'No home page content found.' });
    }
    res.status(200).json({ success: true, data: homePage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 