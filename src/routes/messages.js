const express = require('express');
const Message = require('../models/Message.js');

const router = express.Router();

router.post('/messages', async (req, res) => {
  try {
    const { name, email, phone, budget, website, message } = req.body;
    const newMessage = new Message({ name, email, phone, budget, website, message });
    await newMessage.save();
   
    const io = req.app.get('io');
    if (io) io.emit('new_message', newMessage);
    res.status(201).json({ success: true, message: 'Message saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save message', error: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete message', error: err.message });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Message.countDocuments();
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      messages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
});

module.exports = router;