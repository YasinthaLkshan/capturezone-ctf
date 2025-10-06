const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware (minimal for CTF purposes)
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for XSS demonstration
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://golden-platypus-e7c981.netlify.app', // Production frontend
    'https://capturezone-ctf-production.up.railway.app' // Allow self-requests
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Set Pug as template engine for SSTI vulnerability
app.set('view engine', 'pug');
app.set('views', './views');

// Database connection
const mongoUri = process.env.MONGODB_URI?.replace('<db_password>', process.env.DB_PASSWORD) || 'mongodb://localhost:27017/cybersphere-labs';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
console.log('Loading auth routes...');
const authRoutes = require('./routes/auth');
console.log('Auth routes loaded, type:', typeof authRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/modules', require('./routes/modules'));
app.use('/api/flags', require('./routes/flags'));
app.use('/api/progress', require('./routes/progress'));

// Vulnerable endpoints for CTF modules
app.use('/api/vulnerable', require('./routes/vulnerable'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CyberSphere Labs CTF Platform API', 
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      modules: '/api/modules',
      test: '/api/test'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'CyberSphere Labs API is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CyberSphere Labs server running on port ${PORT}`);
  console.log(`🎯 CTF Platform initialized - Educational purposes only`);
  console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
});

module.exports = app;