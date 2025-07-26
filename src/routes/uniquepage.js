const express = require('express');
const router = express.Router();
const UniquePage = require('../models/UniquePage');

// GET /api/uniquepage/ - fetch unique page data
router.get('/', async (req, res) => {
  try {
    const data = await UniquePage.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unique page data' });
  }
});

// PUT /api/uniquepage/ - update or create unique page data
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

// POST /api/uniquepage/list-item - add an item to a list (others or adryter)
router.post('/list-item', async (req, res) => {
  try {
    const { list, value } = req.body; // list: 'others' or 'adryter'
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

// DELETE /api/uniquepage/list-item - remove an item from a list by index and list name
router.delete('/list-item', async (req, res) => {
  try {
    const { list, index } = req.body; // list: 'others' or 'adryter', index: number
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