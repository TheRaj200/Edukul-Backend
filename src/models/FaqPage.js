const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const FaqPageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  faqs: { type: [FaqSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('FaqPage', FaqPageSchema); 