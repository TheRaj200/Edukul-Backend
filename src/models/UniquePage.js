const mongoose = require('mongoose');

const UniquePageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  others: { type: [String], required: true },
  adryter: { type: [String], required: true },
  chatText: { type: String, required: true },
  chatLink: { type: String, required: true },
  chatLinkText: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('UniquePage', UniquePageSchema); 