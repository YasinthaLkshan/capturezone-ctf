const mongoose = require('mongoose');
const User = require('./models/User');
const Module = require('./models/Module');
const Admin = require('./models/Admin');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI?.replace('<db_password>', process.env.DB_PASSWORD) || 'mongodb://localhost:27017/cybersphere-labs';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing data (for fresh setup)
    await User.deleteMany({});
    await Module.deleteMany({});
    await Admin.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create default admin user for CTF
    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'secret123',
      permissions: ['read', 'write', 'delete', 'manage_users'],
      metadata: { 
        role: 'super_admin',
        created_for: 'ctf_challenge'
      }
    });
    await defaultAdmin.save();

    // Create sample vulnerable admin for NoSQL injection
    const vulnerableAdmin = new Admin({
      username: 'ctf_admin',
      password: 'password123',
      permissions: ['read'],
      metadata: { 
        role: 'ctf_user',
        hint: 'Try NoSQL injection techniques'
      }
    });
    await vulnerableAdmin.save();

    console.log('👤 Created admin users for CTF');

    // Initialize CTF modules
    const ctfModules = [
      {
        id: 1,
        name: 'feedback-portal',
        title: 'Feedback Portal',
        description: 'A customer feedback system with client-side vulnerabilities. Submit feedback and observe how the application processes your input.',
        vulnerability: 'DOM-Based XSS',
        owaspCategory: 'A07:2021 – Cross-Site Scripting (XSS)',
        difficulty: 'Easy',
        flag: 'CYBER{dom_xss_flag}',
        hints: [
          'The feedback form displays user input without proper sanitization',
          'Try injecting JavaScript code in the message field',
          'Look for DOM manipulation that executes user-controlled content',
          'Payload example: <script>alert("XSS")</script>'
        ],
        documentation: {
          overview: 'DOM-based XSS vulnerabilities occur when client-side JavaScript processes user input in an unsafe manner, leading to script execution in the victim\'s browser.',
          vulnerability_details: 'The feedback portal accepts user input and dynamically inserts it into the DOM without proper sanitization or encoding. This allows attackers to inject malicious JavaScript that executes in the context of the application.',
          exploitation_steps: [
            'Navigate to the Feedback Portal module',
            'Fill out the feedback form with normal information',
            'In the message field, inject an XSS payload: <script>alert("XSS Success")</script>',
            'Submit the form and observe the script execution',
            'The flag will be revealed when successful DOM-based XSS is detected'
          ],
          prevention: 'Always sanitize and encode user input before inserting into the DOM. Use safe DOM manipulation methods and implement Content Security Policy (CSP).',
          references: [
            'https://owasp.org/www-community/attacks/DOM_Based_XSS',
            'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
          ]
        }
      },
      {
        id: 2,
        name: 'digital-archive',
        title: 'Digital Archive',
        description: 'A document management system that can fetch and display remote resources. Test the URL fetching functionality.',
        vulnerability: 'SSRF',
        owaspCategory: 'A10:2021 – Server-Side Request Forgery (SSRF)',
        difficulty: 'Medium',
        flag: 'CYBER{ssrf_flag}',
        hints: [
          'The archive system makes HTTP requests to user-provided URLs',
          'Try accessing internal network resources that shouldn\'t be publicly accessible',
          'Look for localhost, 127.0.0.1, or other internal IP addresses',
          'Internal services might be running on different ports'
        ],
        documentation: {
          overview: 'Server-Side Request Forgery (SSRF) allows attackers to make HTTP requests from the vulnerable server to internal or external resources, potentially accessing sensitive information or internal services.',
          vulnerability_details: 'The digital archive system accepts URLs from users and makes server-side HTTP requests without proper validation, allowing access to internal network resources.',
          exploitation_steps: [
            'Navigate to the Digital Archive module',
            'Try fetching a normal external URL to understand the functionality',
            'Attempt to access internal resources: http://localhost:5001/admin',
            'Try other internal addresses: http://127.0.0.1:5002/internal',
            'The flag will be revealed when internal resources are successfully accessed'
          ],
          prevention: 'Implement URL validation, use allowlists for permitted domains, and restrict access to internal network ranges.',
          references: [
            'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/',
            'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html'
          ]
        }
      },
      {
        id: 3,
        name: 'system-diagnostics',
        title: 'System Diagnostics',
        description: 'A secure system access portal that requires authentication to access diagnostic tools and monitoring capabilities.',
        vulnerability: 'Broken Authentication',
        owaspCategory: 'A02:2021 – Broken Authentication',
        difficulty: 'Hard',
        flag: 'CYBER{broken_auth_flag}',
        hints: [
          'The system has weak authentication controls and password policies',
          'Try common weak passwords or credential combinations',
          'Session tokens might bypass password requirements',
          'SQL injection can sometimes bypass authentication logic'
        ],
        documentation: {
          overview: 'Broken Authentication vulnerabilities occur when authentication and session management are implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens.',
          vulnerability_details: 'The system diagnostics portal has multiple authentication weaknesses including weak password policies, improper session management, and insufficient input validation.',
          exploitation_steps: [
            'Navigate to the System Diagnostics module',
            'Try weak credentials like admin:123 or admin:password',
            'Attempt SQL injection in the username field: admin\' OR \'1\'=\'1',
            'Test session token bypass by using tokens without passwords',
            'The flag will be revealed when successful authentication bypass is detected'
          ],
          prevention: 'Implement strong password policies, multi-factor authentication, proper session management, and input validation. Use secure authentication frameworks.',
          references: [
            'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
            'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'
          ]
        }
      },
      {
        id: 4,
        name: 'admin-portal',
        title: 'Admin Portal',
        description: 'Administrative interface with authentication system. Access requires valid administrator credentials.',
        vulnerability: 'NoSQL Injection',
        owaspCategory: 'A03:2021 – Injection',
        difficulty: 'Medium',
        flag: 'CYBER{nosql_injection_flag}',
        hints: [
          'The login system uses MongoDB for authentication',
          'NoSQL databases can be vulnerable to injection attacks similar to SQL injection',
          'Try using MongoDB operators in the login fields',
          'MongoDB operators: $ne, $gt, $lt, $regex, etc.'
        ],
        documentation: {
          overview: 'NoSQL Injection occurs when user input is directly embedded into NoSQL database queries without proper sanitization, allowing attackers to manipulate query logic.',
          vulnerability_details: 'The admin portal constructs MongoDB queries using user input without proper validation, allowing authentication bypass through query manipulation.',
          exploitation_steps: [
            'Navigate to the Admin Portal module',
            'Try normal login with admin:admin (should fail)',
            'Use NoSQL injection in username field: {"$ne": null}',
            'Use similar injection in password field: {"$ne": null}',
            'Send the request with JSON content-type',
            'The flag will be revealed upon successful authentication bypass'
          ],
          prevention: 'Use parameterized queries, input validation, and proper data typing for NoSQL databases.',
          references: [
            'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection',
            'https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html'
          ]
        }
      }
    ];

    await Module.insertMany(ctfModules);
    console.log('🎯 Created CTF modules');

    // Create a demo user
    const demoUser = new User({
      username: 'demo',
      email: 'demo@cybersphere.labs',
      password: 'demo123',
      role: 'student'
    });
    await demoUser.save();

    console.log('🎓 Created demo user (demo:demo123)');

    console.log('✅ Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - 4 CTF modules created');
    console.log('   - 2 admin accounts created for CTF');
    console.log('   - 1 demo user account created');
    console.log('   - Database ready for CTF platform');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;