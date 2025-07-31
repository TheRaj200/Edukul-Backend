const express = require('express');
const router = express.Router();
const UniquePage = require('../models/UniquePage');


router.get('/', async (req, res) => {
  try {
    const data = await UniquePage.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unique page data' });
  }
});


router.put('/', async (req, res) => {
  try {
    const { heading, subheading, others, adryter, chatText, chatLink, chatLinkText } = req.body;
    let data = await UniquePage.findOne();
    if (data) {
      data.heading = heading;
      data.subheading = subheading;
      data.others = others;
      data.adryter = adryter;
      data.chatText = chatText;
      data.chatLink = chatLink;
      data.chatLinkText = chatLinkText;
      await data.save();
    } else {
      data = await UniquePage.create({ heading, subheading, others, adryter, chatText, chatLink, chatLinkText });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update unique page data' });
  }
});


router.post('/list-item', async (req, res) => {
  try {
    const { list, value } = req.body; 
    if (!['others', 'adryter'].includes(list)) {
      return res.status(400).json({ error: 'Invalid list name' });
    }
    let data = await UniquePage.findOne();
    if (!data) {
      return res.status(404).json({ error: 'Unique page data not found' });
    }
    data[list].push(value);
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to list' });
  }
});


router.delete('/list-item', async (req, res) => {
  try {
    const { list, index } = req.body; 
    if (!['others', 'adryter'].includes(list)) {
      return res.status(400).json({ error: 'Invalid list name' });
    }
    let data = await UniquePage.findOne();
    if (!data) {
      return res.status(404).json({ error: 'Unique page data not found' });
    }
    if (typeof index !== 'number' || index < 0 || index >= data[list].length) {
      return res.status(400).json({ error: 'Invalid index' });
    }
    data[list].splice(index, 1);
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item from list' });
  }
});

module.exports = router; 