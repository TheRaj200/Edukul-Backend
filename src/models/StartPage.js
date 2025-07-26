const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
}, { _id: false });

const StartPageSchema = new mongoose.Schema({
  steps: { type: [StepSchema], required: true },
}, { timestamps: true });

module.exports = mongoose.model('StartPage', StartPageSchema); 