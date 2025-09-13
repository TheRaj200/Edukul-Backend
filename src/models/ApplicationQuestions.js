const mongoose = require('mongoose');

const ApplicationQuestionsSchema = new mongoose.Schema(
  {
    heading: { type: String, default: 'Additional Information' },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApplicationQuestions', ApplicationQuestionsSchema);
