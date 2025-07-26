const express = require('express');
const router = express.Router();
const FaqPage = require('../models/FaqPage');

// GET /api/faqpage/ - fetch FAQ page data
router.get('/', async (req, res) => {
  try {
    const data = await FaqPage.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQ page data' });
  }
});

// PUT /api/faqpage/ - update or create FAQ page data
router.put('/', async (req, res) => {
  try {
    const { heading, faqs } = req.body;
    let data = await FaqPage.findOne();
    if (data) {
      data.heading = heading;
      data.faqs = faqs;
      await data.save();
    } else {
      data = await FaqPage.create({ heading, faqs });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update FAQ page data' });
  }
});

// POST /api/faqpage/faq - add a new FAQ
router.post('/faq', async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    let data = await FaqPage.findOne();
    if (!data) {
      data = await FaqPage.create({ heading: 'Frequently Asked Questions', faqs: [{ question, answer }] });
    } else {
      data.faqs.push({ question, answer });
      await data.save();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// DELETE /api/faqpage/faq - remove an FAQ by index
router.delete('/faq', async (req, res) => {
  try {
    const { index } = req.body;
    let data = await FaqPage.findOne();
    if (!data) {
      return res.status(404).json({ error: 'FAQ page not found' });
    }
    if (typeof index !== 'number' || index < 0 || index >= data.faqs.length) {
      return res.status(400).json({ error: 'Invalid index' });
    }
    data.faqs.splice(index, 1);
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router; 