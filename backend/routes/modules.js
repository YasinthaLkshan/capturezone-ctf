const express = require('express');
const Module = require('../models/Module');
const router = express.Router();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find({ isActive: true }).sort({ id: 1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get specific module
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findOne({ id: req.params.id, isActive: true });
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// Initialize default modules
router.post('/init', async (req, res) => {
  try {
    const existingModules = await Module.countDocuments();
    
    if (existingModules === 0) {
      const defaultModules = [
        {
          id: 1,
          name: 'feedback-portal',
          title: 'Feedback Portal',
          description: 'A customer feedback system with potential client-side vulnerabilities.',
          vulnerability: 'DOM-Based XSS',
          owaspCategory: 'A07:2021 – Cross-Site Scripting (XSS)',
          difficulty: 'Easy',
          flag: 'CYBER{dom_xss_flag}',
          hints: [
            'Check how user input is processed on the client side',
            'Look for areas where JavaScript executes user-controlled data',
            'Try injecting script tags in the feedback form'
          ],
          documentation: {
            overview: 'DOM-based XSS occurs when client-side JavaScript processes user input unsafely.',
            vulnerability_details: 'The feedback form processes user input without proper sanitization before inserting it into the DOM.',
            exploitation_steps: [
              'Navigate to the feedback portal',
              'Enter a script payload in the message field: <script>alert("XSS")</script>',
              'Submit the form and observe the script execution',
              'The flag will be revealed when successful XSS is detected'
            ],
            prevention: 'Always sanitize user input and use safe DOM manipulation methods.',
            references: ['https://owasp.org/www-community/attacks/DOM_Based_XSS']
          }
        },
        {
          id: 2,
          name: 'digital-archive',
          title: 'Digital Archive',
          description: 'A document management system that fetches remote resources.',
          vulnerability: 'SSRF',
          owaspCategory: 'A10:2021 – Server-Side Request Forgery (SSRF)',
          difficulty: 'Medium',
          flag: 'CYBER{ssrf_flag}',
          hints: [
            'The system fetches resources from URLs you provide',
            'Try accessing internal network resources',
            'Look for localhost or internal IP addresses'
          ],
          documentation: {
            overview: 'SSRF allows attackers to make requests to internal resources through the vulnerable application.',
            vulnerability_details: 'The archive system makes HTTP requests to user-supplied URLs without proper validation.',
            exploitation_steps: [
              'Access the digital archive module',
              'Try fetching internal resources like http://localhost:5001/admin',
              'Observe the response for internal system information',
              'The flag will be revealed when internal resources are accessed'
            ],
            prevention: 'Validate and whitelist allowed domains and IP ranges.',
            references: ['https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/']
          }
        },
        {
          id: 3,
          name: 'system-diagnostics',
          title: 'Broken Authentication',
          description: 'A vulnerable authentication system demonstrating common authentication security flaws and bypass techniques.',
          vulnerability: 'SSTI',
          owaspCategory: 'A03:2021 – Injection',
          difficulty: 'Hard',
          flag: 'CYBER{ssti_flag}',
          hints: [
            'The system uses templates to generate reports',
            'Template engines can execute code if input is not sanitized',
            'Try injecting template syntax into user inputs'
          ],
          documentation: {
            overview: 'Server-Side Template Injection occurs when user input is embedded into templates without proper sanitization.',
            vulnerability_details: 'The authentication system uses Pug templates with user-controlled input.',
            exploitation_steps: [
              'Access the Broken Authentication module',
              'Inject template syntax: #{process.version}',
              'Try accessing global objects through template injection',
              'The flag will be revealed when successful template injection is detected'
            ],
            prevention: 'Never embed user input directly into templates. Use parameterized templates.',
            references: ['https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/07-Input_Validation_Testing/18-Testing_for_Server_Side_Template_Injection']
          }
        },
        {
          id: 4,
          name: 'admin-portal',
          title: 'Admin Portal',
          description: 'Administrative interface with authentication system.',
          vulnerability: 'NoSQL Injection',
          owaspCategory: 'A03:2021 – Injection',
          difficulty: 'Medium',
          flag: 'CYBER{nosql_injection_flag}',
          hints: [
            'The login system uses MongoDB queries',
            'NoSQL databases can be vulnerable to injection attacks',
            'Try using MongoDB operators in login fields'
          ],
          documentation: {
            overview: 'NoSQL injection occurs when user input is directly embedded into NoSQL queries.',
            vulnerability_details: 'The admin login system constructs MongoDB queries using user input without proper sanitization.',
            exploitation_steps: [
              'Access the admin portal login',
              'Use NoSQL injection in username: {"$ne": null}',
              'Use any password or similar injection in password field',
              'Bypass authentication through query manipulation',
              'The flag will be revealed upon successful login bypass'
            ],
            prevention: 'Use parameterized queries and input validation for NoSQL databases.',
            references: ['https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection']
          }
        }
      ];

      await Module.insertMany(defaultModules);
      res.json({ message: 'Default modules initialized', count: defaultModules.length });
    } else {
      res.json({ message: 'Modules already exist', count: existingModules });
    }
  } catch (error) {
    console.error('Module initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize modules' });
  }
});

module.exports = router;