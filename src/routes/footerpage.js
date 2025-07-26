const express = require('express');
const router = express.Router();
const FooterPage = require('../models/FooterPage');

// GET /api/footerpage/ - fetch footer content
router.get('/', async (req, res) => {
  try {
    const data = await FooterPage.findOne();
    if (!data) {
      return res.status(404).json({ success: false, message: 'No footer content found.' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/footerpage/ - update or create footer content
router.put('/', async (req, res) => {
  const { 
    logo, 
    aboutHeading, 
    address1, 
    address2, 
    supportHeading, 
    phone1, 
    phone2, 
    copyright, 
    privacyLink, 
    tncLink, 
    social 
  } = req.body;
  
  try {
    let data = await FooterPage.findOne();
    if (data) {
      // Update existing data
      data.logo = logo || data.logo;
      data.aboutHeading = aboutHeading || data.aboutHeading;
      data.address1 = address1 || data.address1;
      data.address2 = address2 || data.address2;
      data.supportHeading = supportHeading || data.supportHeading;
      data.phone1 = phone1 || data.phone1;
      data.phone2 = phone2 || data.phone2;
      data.copyright = copyright || data.copyright;
      data.privacyLink = privacyLink || data.privacyLink;
      data.tncLink = tncLink || data.tncLink;
      data.social = social || data.social;
      await data.save();
    } else {
      // Create new data
      data = new FooterPage({ 
        logo, 
        aboutHeading, 
        address1, 
        address2, 
        supportHeading, 
        phone1, 
        phone2, 
        copyright, 
        privacyLink, 
        tncLink, 
        social 
      });
      await data.save();
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 