const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');
const Admin = require('../models/Admin');
const Feedback = require('../models/Feedback');
const router = express.Router();

// ===============================
// MODULE 1: DOM-Based XSS (Feedback Portal)
// ===============================

// Get feedback form
router.get('/feedback', (req, res) => {
  res.json({
    message: 'Feedback portal is ready',
    hint: 'Submit feedback and check how it gets processed...'
  });
});

// Submit feedback (vulnerable to DOM-based XSS)
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;
    
    // Intentionally vulnerable - no input sanitization
    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      rating
    });

    await feedback.save();

    // Return the raw message for DOM manipulation
    res.json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: {
        id: feedback._id,
        name: name, // Vulnerable: unsanitized data returned
        email: email,
        subject: subject,
        message: message, // This can contain XSS payload
        rating: rating,
        submittedAt: feedback.createdAt
      },
      // Flag check - reveal flag when XSS payload is detected
      flag: message && (
        message.includes('<script>') || 
        message.includes('javascript:') || 
        message.includes('onerror=') || 
        message.includes('onload=') || 
        message.includes('onclick=') ||
        message.includes('<img') && message.includes('onerror')
      ) ? (
        process.env.FLAG_MODULE_1 ? 
          Buffer.from(process.env.FLAG_MODULE_1, 'base64').toString() : 
          'CYBER{x55_1n_f33db4ck_p0rt4l}'
      ) : null
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ===============================
// MODULE 2: SSRF (Digital Archive)
// ===============================

// Fetch remote resource (vulnerable to SSRF)
router.post('/archive/fetch', (req, res) => {
  const { url: targetUrl } = req.body;
  
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Intentionally vulnerable - no URL validation
    const parsedUrl = url.parse(targetUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = protocol.get(targetUrl, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        // Check for flag in internal response
        const isInternalRequest = targetUrl.includes('localhost') || 
                                 targetUrl.includes('127.0.0.1') ||
                                 targetUrl.includes('internal');
        
        res.json({
          success: true,
          url: targetUrl,
          data: data,
          flag: (targetUrl.includes('localhost') || 
                targetUrl.includes('127.0.0.1') ||
                targetUrl.includes('internal') ||
                targetUrl.includes('file://') ||
                targetUrl.includes('192.168') ||
                targetUrl.includes('10.') ||
                targetUrl.includes('169.254')) ? (
            process.env.FLAG_MODULE_2 ? 
              Buffer.from(process.env.FLAG_MODULE_2, 'base64').toString() : 
              'CYBER{55rf_3xpl01t_5ucc355}'
          ) : null
        });
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ 
        error: 'Failed to fetch resource',
        details: error.message 
      });
    });

    request.setTimeout(5000, () => {
      request.destroy();
      res.status(408).json({ error: 'Request timeout' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Invalid URL format' });
  }
});

// ===============================
// MODULE 3: Broken Authentication (System Diagnostics)
// ===============================

// System authentication with broken authentication
router.post('/system-auth', async (req, res) => {
  try {
    const { username, password, sessionToken } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Intentionally vulnerable authentication logic
    let authenticated = false;
    let user = null;
    let adminAccess = false;
    let authMethod = '';

    // Vulnerability 1: Weak password check
    if (username === 'admin' && (password === '123' || password === 'password' || password === 'admin')) {
      authenticated = true;
      authMethod = 'weak_password';
      user = { username: 'admin', role: 'administrator', permissions: ['read', 'write', 'delete'] };
      adminAccess = true;
    }

    // Vulnerability 2: SQL Injection bypass (simulated)
    else if (username.includes("'") || username.includes("OR") || username.includes("1=1")) {
      authenticated = true;
      authMethod = 'sql_injection';
      user = { username: 'admin', role: 'administrator', permissions: ['read', 'write', 'delete'] };
      adminAccess = true;
    }

    // Vulnerability 3: Session token bypass
    else if (sessionToken && (
      sessionToken === 'admin_session_token' || 
      sessionToken === 'expired_admin_token_abc123' ||
      sessionToken.includes('admin') ||
      sessionToken.includes('debug')
    )) {
      authenticated = true;
      authMethod = 'session_bypass';
      user = { username: username, role: 'administrator', permissions: ['read', 'write', 'delete'] };
      adminAccess = true;
    }

    // Vulnerability 4: Empty password with token
    else if (!password && sessionToken) {
      authenticated = true;
      authMethod = 'empty_password_bypass';
      user = { username: username, role: 'user', permissions: ['read'] };
    }

    // Vulnerability 5: Case insensitive bypass
    else if (username.toLowerCase() === 'admin' && password && password.length > 0) {
      authenticated = true;
      authMethod = 'case_insensitive';
      user = { username: 'Admin', role: 'administrator', permissions: ['read', 'write', 'delete'] };
      adminAccess = true;
    }

    if (authenticated) {
      const sessionId = `${authMethod}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({
        success: true,
        message: 'Authentication successful',
        user: user,
        sessionId: sessionId,
        authMethod: authMethod,
        adminAccess: adminAccess,
        flag: adminAccess ? (
          process.env.FLAG_MODULE_3 ? 
            Buffer.from(process.env.FLAG_MODULE_3, 'base64').toString() : 
            'CYBER{br0k3n_4uth_byp455}'
        ) : null
      });
    } else {
      res.status(401).json({ 
        error: 'Authentication failed. Invalid credentials.',
        hint: 'Try weak passwords, SQL injection, or session tokens...'
      });
    }

  } catch (error) {
    res.status(500).json({ 
      error: 'Authentication system error',
      details: error.message 
    });
  }
});

// ===============================
// MODULE 4: NoSQL Injection (Admin Portal)
// ===============================

// Admin login (vulnerable to NoSQL injection)
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Intentionally vulnerable - direct object injection
    const query = {
      username: username,
      password: password,
      isActive: true
    };

    const admin = await Admin.findOne(query);

    if (admin) {
      res.json({
        success: true,
        message: 'Admin login successful',
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        },
        flag: process.env.FLAG_MODULE_4 ? 
          Buffer.from(process.env.FLAG_MODULE_4, 'base64').toString() : 
          'CYBER{n05ql_1nj3ct10n_pwn3d}'
      });
    } else {
      res.status(401).json({ 
        error: 'Invalid credentials',
        hint: 'Try different authentication methods...'
      });
    }

  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
});

// Create default admin for testing
router.post('/admin/setup', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const admin = new Admin({
        username: 'admin',
        password: 'secret123',
        permissions: ['read', 'write', 'delete'],
        metadata: { role: 'super_admin' }
      });
      
      await admin.save();
      res.json({ message: 'Admin user created for CTF' });
    } else {
      res.json({ message: 'Admin user already exists' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Setup failed' });
  }
});

module.exports = router;