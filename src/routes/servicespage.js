const express = require('express');
const router = express.Router();
const ServicesPage = require('../models/ServicesPage');

// Update or create ServicesPage content
router.put('/', async (req, res) => {
  const { tagline, heading, services, discussLink } = req.body;
  try {
    let servicesPage = await ServicesPage.findOne();
    if (servicesPage) {
      servicesPage.tagline = tagline;
      servicesPage.heading = heading;
      servicesPage.services = services;
      servicesPage.discussLink = discussLink;
      await servicesPage.save();
    } else {
      servicesPage = new ServicesPage({ tagline, heading, services, discussLink });
      await servicesPage.save();
    }
    res.status(200).json({ success: true, data: servicesPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get ServicesPage content
router.get('/', async (req, res) => {
  try {
    const servicesPage = await ServicesPage.findOne();
    if (!servicesPage) {
      return res.status(404).json({ success: false, message: 'No services page content found.' });
    }
    res.status(200).json({ success: true, data: servicesPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 