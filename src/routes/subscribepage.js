const express = require('express');
const router = express.Router();
const SubscribePage = require('../models/SubscribePage');

// GET /api/subscribepage/ - fetch subscribe section
router.get('/', async (req, res) => {
  try {
    const data = await SubscribePage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: 'No subscribe section found.' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/subscribepage/ - update or create subscribe section
router.put('/', async (req, res) => {
  const { heading, subheading, buttonText, socialIcons } = req.body;
  try {
    let data = await SubscribePage.findOne();
    if (data) {
      data.heading = heading;
      data.subheading = subheading;
      data.buttonText = buttonText;
      data.socialIcons = socialIcons;
      await data.save();
    } else {
      data = new SubscribePage({ heading, subheading, buttonText, socialIcons });
      await data.save();
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 