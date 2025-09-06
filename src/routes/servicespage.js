const express = require('express');
const router = express.Router();
const ServicesPage = require('../models/ServicesPage');


router.put('/', async (req, res) => {
  const { tagline, heading, services, discussLink } = req.body;
  try {
    // Validate that services have the required fields
    if (services && Array.isArray(services)) {
      services.forEach(service => {
        if (!service.title || !service.desc) {
          throw new Error('Each service must have title and desc fields');
        }
      });
    }

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