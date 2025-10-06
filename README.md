# 🔒 CyberSphere Labs - CTF Platform

A comprehensive Capture The Flag (CTF) platform designed for university web security education. This interactive platform simulates a futuristic tech company's internal system with deliberately implemented security vulnerabilities for educational purposes.

## 🎯 Overview

CyberSphere Labs is a MERN stack application that provides hands-on experience with real-world web security vulnerabilities mapped to the OWASP Top 10. Students can explore, exploit, and learn from four distinct security modules in a safe, controlled environment.

## 🚨 ⚠️ IMPORTANT SECURITY NOTICE ⚠️

**This application contains intentionally vulnerable code for educational purposes only.**

- 🚫 **DO NOT** deploy this application to production environments
- 🚫 **DO NOT** use these code patterns in real applications
- 🚫 **DO NOT** expose this application to the public internet
- ✅ **USE ONLY** in isolated educational environments
- ✅ **ALWAYS** follow secure coding practices in production

## 🎮 Available Modules

### Module 1: Feedback Portal - DOM-Based XSS
- **Vulnerability**: Cross-Site Scripting (XSS)
- **OWASP Category**: A07:2021 – Cross-Site Scripting
- **Difficulty**: Easy
- **Learning Objective**: Understand client-side script injection

### Module 2: Digital Archive - SSRF
- **Vulnerability**: Server-Side Request Forgery
- **OWASP Category**: A10:2021 – Server-Side Request Forgery
- **Difficulty**: Medium
- **Learning Objective**: Explore internal network access

### Module 3: System Diagnostics - Broken Authentication
- **Vulnerability**: Broken Authentication
- **OWASP Category**: A02:2021 – Broken Authentication
- **Difficulty**: Hard
- **Learning Objective**: Understand authentication bypass techniques

### Module 4: Admin Portal - NoSQL Injection
- **Vulnerability**: NoSQL Injection
- **OWASP Category**: A03:2021 – Injection
- **Difficulty**: Medium
- **Learning Objective**: Database query manipulation

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for HTTP requests
- **Cyberpunk-themed** custom CSS

## 📋 Prerequisites

Before setting up CyberSphere Labs, ensure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0.0 or higher)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cybersphere-labs
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env:
# - MongoDB connection string
# - JWT secret
# - Port configuration
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Database Setup

```bash
# Start MongoDB service
# On Windows: Start MongoDB service from Services
# On Mac/Linux: sudo service mongod start

# Initialize the database
cd ../backend
node init-db.js
```

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend build)
cd ../backend
npm start
```

## 🔑 Default Credentials

### Student Account
- **Username**: demo
- **Password**: demo123

### Admin Accounts (for NoSQL module)
- **Username**: admin
- **Password**: secret123
- **Username**: ctf_admin
- **Password**: password123

## 🎯 How to Use

### For Students:

1. **Register/Login**: Create an account or use demo credentials
2. **Explore Modules**: Browse available security modules
3. **Study Documentation**: Read vulnerability explanations and exploitation guides
4. **Access Labs**: Use lab environments to practice exploitation
5. **Capture Flags**: Successfully exploit vulnerabilities to reveal flags
6. **Submit Flags**: Copy flags and submit them for progress tracking
7. **Track Progress**: Monitor your completion status on the dashboard

### For Instructors:

1. **Module Management**: Use the backend API to manage modules and flags
2. **Progress Monitoring**: Access user progress through the database
3. **Leaderboard**: Track student performance and engagement
4. **Custom Challenges**: Modify or add new vulnerability modules

## 🔍 Exploitation Examples

### XSS (Module 1)
```html
<!-- Payload for feedback message field -->
<script>alert('XSS Success')</script>
```

### SSRF (Module 2)
```
# Try these URLs in the Digital Archive
http://localhost:5001/admin
http://127.0.0.1:5002/internal
```

### Broken Authentication (Module 3)
```javascript
// Authentication bypass techniques
Username: admin' OR '1'='1
Password: (anything)

// Session token bypass
Username: admin
Password: (empty)
SessionToken: admin_session_token

// Weak credentials
Username: admin
Password: 123
```

### NoSQL Injection (Module 4)
```json
{
  "username": {"$ne": null},
  "password": {"$ne": null}
}
```

## 📁 Project Structure

```
cybersphere-labs/
├── backend/
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Custom middleware
│   ├── views/           # View templates
│   ├── server.js        # Main server file
│   ├── init-db.js       # Database initialization
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── App.tsx      # Main App component
│   └── package.json
└── docs/               # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get specific module
- `POST /api/modules/init` - Initialize default modules

### Vulnerable Endpoints (For CTF)
- `POST /api/vulnerable/feedback` - XSS vulnerable feedback
- `POST /api/vulnerable/archive/fetch` - SSRF vulnerable archive
- `POST /api/vulnerable/system-auth` - Broken authentication system
- `POST /api/vulnerable/admin/login` - NoSQL injection login

### Progress & Flags
- `POST /api/flags/validate` - Validate captured flags
- `GET /api/progress` - Get user progress
- `GET /api/progress/leaderboard` - Get leaderboard

## 🛡️ Security Considerations

### Intentional Vulnerabilities

This platform deliberately includes:
- Unvalidated user input processing
- Direct object injection into database queries
- Insecure authentication mechanisms
- Server-side request forgery endpoints
- Cross-site scripting vulnerabilities

### Mitigation for Educational Use

- Run only in isolated network environments
- Use non-privileged user accounts
- Implement network segmentation
- Regular monitoring and logging
- Clear usage guidelines for students

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```bash
# Check MongoDB status
mongosh --eval "db.stats()"

# Restart MongoDB service
sudo service mongod restart
```

**Port Already in Use:**
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change port in .env file
PORT=5001
```

**Module Initialization Failed:**
```bash
# Manually initialize database
cd backend
node init-db.js
```

## 📚 Educational Resources

### OWASP References
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)

### Additional Learning
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [Damn Vulnerable Web Application (DVWA)](https://dvwa.co.uk/)

## 🤝 Contributing

This project is designed for educational use. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Add new vulnerability modules or improve existing ones
4. Ensure all vulnerabilities are well-documented
5. Submit a pull request with detailed explanations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is designed solely for educational purposes in cybersecurity training. The developers are not responsible for any misuse of the vulnerabilities demonstrated in this platform. Users must ensure they have proper authorization before testing security techniques and should never use these methods against systems they do not own or have explicit permission to test.

## 🙋‍♂️ Support

For educational support or questions about the platform:

1. Check the documentation in `/docs/`
2. Review the module-specific guides
3. Consult the troubleshooting section
4. Contact your instructor or course coordinator

---

**Happy Hacking! 🔒👨‍💻👩‍💻**

*Remember: With great power comes great responsibility. Use your cybersecurity knowledge to protect and defend, not to harm.*