const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./src/db/connect.js');
const authRoutes = require('./src/routes/auth.js');
const messagesRoutes = require('./src/routes/messages.js');
const homepageRoutes = require('./src/routes/homepage.js');
const aboutPageRoutes = require('./src/routes/aboutpage.js');
const servicesPageRoutes = require('./src/routes/servicespage.js');
const progressPageRoutes = require('./src/routes/progresspage.js');
const teamPageRoutes = require('./src/routes/teampage.js');
const imagekitRoutes = require('./src/routes/imagekit.js');
const testimonialsPageRoutes = require('./src/routes/testimonialspage.js');
const startPageRoute = require('./src/routes/startpage.js');
const uniquePageRoute = require('./src/routes/uniquepage.js');
const faqPageRoute = require('./src/routes/faqpage.js');
const subscribePageRoutes = require('./src/routes/subscribepage.js');
const footerPageRoutes = require('./src/routes/footerpage.js');
const blogPageRoutes = require('./src/routes/blogpage.js');
const navbarPageRoutes = require('./src/routes/navbarpage.js');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adryter';


app.use(cors());
app.use(express.json({ limit: '10mb' }));


app.use('/api', authRoutes);
app.use('/api', messagesRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/aboutpage', aboutPageRoutes);
app.use('/api/servicespage', servicesPageRoutes);
app.use('/api/progresspage', progressPageRoutes);
app.use('/api/teampage', teamPageRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/testimonialspage', testimonialsPageRoutes);
app.use('/api/startpage', startPageRoute);
app.use('/api/uniquepage', uniquePageRoute);
app.use('/api/faqpage', faqPageRoute);
app.use('/api/subscribepage', subscribePageRoutes);
app.use('/api/footerpage', footerPageRoutes);
app.use('/api/blogpage', blogPageRoutes);
app.use('/api/navbarpage', navbarPageRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});


connectDB(MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = { io }; 