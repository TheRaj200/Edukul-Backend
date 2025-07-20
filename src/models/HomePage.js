const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', HomePageSchema); 