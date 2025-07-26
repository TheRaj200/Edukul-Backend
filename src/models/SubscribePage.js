const mongoose = require('mongoose');

const SocialIconSchema = new mongoose.Schema({
  image: { type: String, required: true },
}, { _id: false });

const SubscribePageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  buttonText: { type: String, required: true },
  socialIcons: { type: [SocialIconSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('SubscribePage', SubscribePageSchema); 