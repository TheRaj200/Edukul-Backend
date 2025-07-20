import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/db/connect.js';
import authRoutes from './src/routes/auth.js';
import messagesRoutes from './src/routes/messages.js';
import homepageRoutes from './src/routes/homepage.js';
import aboutPageRoutes from './src/routes/aboutpage.js';
import servicesPageRoutes from './src/routes/servicespage.js';
import progressPageRoutes from './src/routes/progresspage.js';
import teamPageRoutes from './src/routes/teampage.js';
import imagekitRoutes from './src/routes/imagekit.js';
import testimonialsPageRoutes from './src/routes/testimonialspage.js';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Development ke liye, production me specific origin
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adryter';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', authRoutes);
app.use('/api', messagesRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/aboutpage', aboutPageRoutes);
app.use('/api/servicespage', servicesPageRoutes);
app.use('/api/progresspage', progressPageRoutes);
app.use('/api/teampage', teamPageRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/testimonialspage', testimonialsPageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Connect to MongoDB and start server
connectDB(MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { io }; 