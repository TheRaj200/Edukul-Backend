const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true } // imagekit.io URL or base64
}, { _id: false });

const TeamPageSchema = new mongoose.Schema({
  label: { type: String, required: true },
  heading: { type: String, required: true },
  team: [TeamMemberSchema]
}, { timestamps: true });

module.exports = mongoose.model('TeamPage', TeamPageSchema); 