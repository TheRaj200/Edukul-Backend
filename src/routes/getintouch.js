const express = require('express');
const router = express.Router();
const GetInTouch = require('../models/GetInTouch');

// POST / => create a new get-in-touch entry
router.post('/', async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.studentName || !data.phoneNumber) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Attach metadata
    data.ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    data.userAgent = req.get('User-Agent') || '';

    const doc = new GetInTouch(data);
    const saved = await doc.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('GetInTouch save error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// GET / => list entries with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      GetInTouch.countDocuments(),
      GetInTouch.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({ success: true, data, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('GetInTouch list error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /:id => delete entry by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await GetInTouch.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    return res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error('GetInTouch delete error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
