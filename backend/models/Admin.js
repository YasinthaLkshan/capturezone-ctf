const mongoose = require('mongoose');

// Vulnerable document structure for NoSQL injection
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  permissions: [{
    type: String
  }],
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  // Intentionally vulnerable field for NoSQL injection
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);