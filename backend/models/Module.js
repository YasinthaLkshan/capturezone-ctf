const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vulnerability: {
    type: String,
    required: true,
    enum: ['DOM-Based XSS', 'SSRF', 'SSTI', 'NoSQL Injection']
  },
  owaspCategory: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  flag: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  documentation: {
    overview: String,
    vulnerability_details: String,
    exploitation_steps: [String],
    prevention: String,
    references: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);