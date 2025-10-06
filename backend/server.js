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
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DB_PASSWORD exists:', !!process.env.DB_PASSWORD);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);

const mongoUri = process.env.MONGODB_URI?.replace('<db_password>', process.env.DB_PASSWORD) || 'mongodb://localhost:27017/cybersphere-labs';
console.log('Final MongoDB URI (password hidden):', mongoUri.replace(process.env.DB_PASSWORD || '', '***'));

console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('Full error:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
console.log('Loading auth routes...');
try {
  const authRoutes = require('./routes/auth');
  console.log('Auth routes loaded successfully, type:', typeof authRoutes);
  app.use('/api/auth', authRoutes);
} catch (error) {
  console.error('Error loading auth routes:', error.message);
  // Create a fallback auth route
  app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Fallback auth route - database connection issue', error: error.message });
  });
  app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Fallback auth route - database connection issue', error: error.message });
  });
}

app.use('/api/modules', require('./routes/modules'));
app.use('/api/flags', require('./routes/flags'));
app.use('/api/progress', require('./routes/progress'));

// Vulnerable endpoints for CTF modules
app.use('/api/vulnerable', require('./routes/vulnerable'));

// Test route to check environment
app.get('/api/env-test', (req, res) => {
  res.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    hasDbPassword: !!process.env.DB_PASSWORD,
    nodeEnv: process.env.NODE_ENV,
    mongoUriSample: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not found'
  });
});

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