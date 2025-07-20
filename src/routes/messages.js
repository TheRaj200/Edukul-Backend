import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Save a new message
router.post('/messages', async (req, res) => {
  try {
    const { name, email, phone, budget, website, message } = req.body;
    const newMessage = new Message({ name, email, phone, budget, website, message });
    await newMessage.save();
    // Emit new_message event
    const io = req.app.get('io');
    if (io) io.emit('new_message', newMessage);
    res.status(201).json({ success: true, message: 'Message saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save message', error: err.message });
  }
});

// Get all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: err.message });
  }
});

export default router; 