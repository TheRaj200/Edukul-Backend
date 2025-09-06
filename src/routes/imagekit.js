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
  const { file, fileName, fileType } = req.body;
  if (!file || !fileName) {
    return res.status(400).json({ success: false, message: 'file and fileName are required' });
  }
  try {
    // Determine if it's a video or image based on fileType or file extension
    const isVideo = fileType === 'video' || 
                   fileName.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i);
    
    const response = await imagekit.upload({
      file, 
      fileName,
      useUniqueFileName: true,
      tags: [fileType || (isVideo ? 'video' : 'image')],
      // Add appropriate options for videos
      ...(isVideo && {
        responseFields: ['tags', 'customCoordinates', 'isPrivateFile', 'url', 'thumbnailUrl']
      })
    });
    
    res.status(200).json({ 
      success: true, 
      url: response.url, 
      fileId: response.fileId,
      fileType: isVideo ? 'video' : 'image',
      thumbnailUrl: response.thumbnailUrl || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;