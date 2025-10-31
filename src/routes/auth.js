const express = require('express');

const router = express.Router();


const ADMIN_EMAIL = 'roypathik8@gmail.com';
const ADMIN_PASSWORD = 'Edukul@1234$';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Login successful' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

module.exports = router; 