const mongoose = require('mongoose');

const ProgressBarSchema = new mongoose.Schema({
  label: { type: String, required: true },
  percent: { type: Number, required: true }
}, { _id: false });

const ProgressPageSchema = new mongoose.Schema({
  tagline: { type: String, required: true },
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  bars: [ProgressBarSchema]
}, { timestamps: true });

module.exports = mongoose.model('ProgressPage', ProgressPageSchema); 