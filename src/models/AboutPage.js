const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  num: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const AboutPageSchema = new mongoose.Schema({
  experience: {
    number: { type: String, required: true },
    text: { type: String, required: true }
  },
  tagline: { type: String, required: true },
  heading: { type: String, required: true },
  paragraph: { type: String, required: true },
  stats: [StatSchema]
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', AboutPageSchema); 