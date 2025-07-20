const express = require('express');
const router = express.Router();
const TestimonialsPage = require('../models/TestimonialsPage');

// Update or create TestimonialsPage content
router.put('/', async (req, res) => {
  const { label, heading, testimonials } = req.body;
  try {
    let testimonialsPage = await TestimonialsPage.findOne();
    if (testimonialsPage) {
      testimonialsPage.label = label;
      testimonialsPage.heading = heading;
      testimonialsPage.testimonials = testimonials;
      await testimonialsPage.save();
    } else {
      testimonialsPage = new TestimonialsPage({ label, heading, testimonials });
      await testimonialsPage.save();
    }
    res.status(200).json({ success: true, data: testimonialsPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get TestimonialsPage content
router.get('/', async (req, res) => {
  try {
    const testimonialsPage = await TestimonialsPage.findOne();
    if (!testimonialsPage) {
      return res.status(404).json({ success: false, message: 'No testimonials page content found.' });
    }
    res.status(200).json({ success: true, data: testimonialsPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a testimonial by index
router.delete('/:index', async (req, res) => {
  const idx = parseInt(req.params.index, 10);
  try {
    let testimonialsPage = await TestimonialsPage.findOne();
    if (!testimonialsPage) {
      return res.status(404).json({ success: false, message: 'No testimonials page content found.' });
    }
    if (isNaN(idx) || idx < 0 || idx >= testimonialsPage.testimonials.length) {
      return res.status(400).json({ success: false, message: 'Invalid testimonial index.' });
    }
    testimonialsPage.testimonials.splice(idx, 1);
    await testimonialsPage.save();
    res.status(200).json({ success: true, data: testimonialsPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 