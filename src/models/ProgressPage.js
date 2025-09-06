const mongoose = require('mongoose');

const ProgressItemSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  tag: { type: String, required: true },
  title: { type: String, required: true }
}, { _id: false });

const ProgressPageSchema = new mongoose.Schema({
  tagline: { type: String, required: true, default: "Progress" },
  progressItems: [ProgressItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('ProgressPage', ProgressPageSchema);