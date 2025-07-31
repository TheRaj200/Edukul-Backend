const express = require('express');
const router = express.Router();
const NavbarPage = require('../models/NavbarPage');

// GET /api/navbarpage/ - fetch navbar content
router.get('/', async (req, res) => {
  try {
    let navbar = await NavbarPage.findOne();
    if (!navbar) {
   
      navbar = new NavbarPage();
      await navbar.save();
    }
    res.status(200).json({ success: true, data: navbar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put('/', async (req, res) => {
  try {
    let navbar = await NavbarPage.findOne();
    if (!navbar) {
      navbar = new NavbarPage();
    }
    
    const { chatButtonText, chatLink } = req.body;
    
    navbar.chatButtonText = chatButtonText || navbar.chatButtonText;
    navbar.chatLink = chatLink || navbar.chatLink;
    
    await navbar.save();
    res.status(200).json({ success: true, data: navbar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 