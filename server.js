const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/db/connect.js');
const authRoutes = require('./src/routes/auth.js');
const imagekitRoutes = require('./src/routes/imagekit.js');
const blogPageRoutes = require('./src/routes/blogpage.js');
const registrationRoutes = require('./src/routes/registration.js');


dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;


app.use(cors({
  origin: ["http://localhost:5173", "https://edukulclasses.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '10gb' }));

app.use('/uploads', express.static('src/uploads'));


app.use('/api', authRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/blogpage', blogPageRoutes);
app.use('/api/registration', registrationRoutes);



app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});


connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

