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
const caseStudyRoutes = require('./src/routes/casestudy.js');
const jobsRoutes = require('./src/routes/jobs.js');
const jobApplicationsRoutes = require('./src/routes/jobApplications.js');
const applicationQuestionsRoutes = require('./src/routes/applicationQuestions.js');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://adryter.com", "https://www.adryter.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});
app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;


app.use(cors({
  origin: ["http://localhost:3000", "https://adryter.com", "https://www.adryter.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '10gb' }));

app.use('/uploads', express.static('src/uploads'));


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
app.use('/api/casestudy', caseStudyRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/job-applications', jobApplicationsRoutes);
app.use('/api/application-questions', applicationQuestionsRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});


connectDB(MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = { io };