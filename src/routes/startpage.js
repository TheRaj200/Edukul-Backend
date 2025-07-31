const express = require('express');
const router = express.Router();
const StartPage = require('../models/StartPage');


router.get('/', async (req, res) => {
  try {
    const data = await StartPage.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch start page data' });
  }
});


router.put('/', async (req, res) => {
  try {
    const { steps } = req.body;
    let data = await StartPage.findOne();
    if (data) {
      data.steps = steps;
      await data.save();
    } else {
      data = await StartPage.create({ steps });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update start page data' });
  }
});

module.exports = router; 