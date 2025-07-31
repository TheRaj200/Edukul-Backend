const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');
const dotenv = require('dotenv');
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


router.post('/upload', async (req, res) => {
  const { file, fileName } = req.body;
  if (!file || !fileName) {
    return res.status(400).json({ success: false, message: 'file and fileName are required' });
  }
  try {
    const response = await imagekit.upload({
      file, 
      fileName,
    });
    res.status(200).json({ success: true, url: response.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 