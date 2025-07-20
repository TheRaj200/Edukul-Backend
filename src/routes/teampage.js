const express = require('express');
const router = express.Router();
const TeamPage = require('../models/TeamPage');

// Update or create TeamPage content
router.put('/', async (req, res) => {
  const { label, heading, team } = req.body;
  try {
    let teamPage = await TeamPage.findOne();
    if (teamPage) {
      teamPage.label = label;
      teamPage.heading = heading;
      teamPage.team = team;
      await teamPage.save();
    } else {
      teamPage = new TeamPage({ label, heading, team });
      await teamPage.save();
    }
    res.status(200).json({ success: true, data: teamPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get TeamPage content
router.get('/', async (req, res) => {
  try {
    const teamPage = await TeamPage.findOne();
    if (!teamPage) {
      return res.status(404).json({ success: false, message: 'No team page content found.' });
    }
    res.status(200).json({ success: true, data: teamPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 