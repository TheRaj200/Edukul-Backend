const mongoose = require('mongoose');

const NavbarPageSchema = new mongoose.Schema({
  chatButtonText: { type: String,  },
  chatLink: { type: String, }
}, { timestamps: true });

module.exports = mongoose.model('NavbarPage', NavbarPageSchema); 