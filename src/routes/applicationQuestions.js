const express = require('express');
const router = express.Router();
const ApplicationQuestions = require('../models/ApplicationQuestions');


router.get('/', async (req, res) => {
  try {
    let doc = await ApplicationQuestions.findOne().sort({ updatedAt: -1 });
    if (!doc) {

      doc = await ApplicationQuestions.create({
        heading: 'Additional Information',
        question1: 'Why do you think you are fit for this role?',
        question2:
          'Imagine the CEO has asked you to complete a task that requires information from multiple departments, and some of them are unresponsive. How would you handle this?',
        question3:
          'Can you give an example of a situation where you had to communicate effectively on behalf of an executive?',
      });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put('/', async (req, res) => {
  try {
    const { heading, question1, question2, question3 } = req.body || {};
    if (!question1 || !question2 || !question3) {
      return res
        .status(400)
        .json({ success: false, message: 'All three questions are required.' });
    }
    let doc = await ApplicationQuestions.findOne();
    if (!doc) {
      doc = new ApplicationQuestions({ heading, question1, question2, question3 });
    } else {
      if (heading !== undefined) doc.heading = heading;
      doc.question1 = question1;
      doc.question2 = question2;
      doc.question3 = question3;
    }
    await doc.save();
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
