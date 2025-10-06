# 🚀 CyberSphere Labs - Quick Setup Guide

This guide will help you quickly set up and run the CyberSphere Labs CTF platform for educational purposes.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js v16+** installed ([Download here](https://nodejs.org/))
- [ ] **MongoDB v5+** installed ([Download here](https://www.mongodb.com/try/download/community))
- [ ] **Git** installed ([Download here](https://git-scm.com/downloads))
- [ ] **Terminal/Command Prompt** access
- [ ] **Code Editor** (VS Code recommended)

## ⚡ Quick Start (5 Minutes)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd cybersphere-labs

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Start MongoDB

**Windows (Service):**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB daemon
sudo service mongod start
# OR
brew services start mongodb-community
```

**Docker (Alternative):**
```bash
docker run -d -p 27017:27017 --name cybersphere-mongo mongo:latest
```

### Step 3: Initialize Database

```bash
# Go to backend directory
cd backend

# Initialize CTF modules and users
node init-db.js
```

You should see:
```
✅ Database initialization completed successfully!
📋 Summary:
   - 4 CTF modules created
   - 2 admin accounts created for CTF
   - 1 demo user account created
   - Database ready for CTF platform
```

### Step 4: Start the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### Step 5: Access the Platform

1. Open your browser and go to: **http://localhost:3000**
2. Login with demo credentials:
   - **Username:** demo
   - **Password:** demo123

## 🎯 Testing the Modules

### Module 1: XSS (Easy)
1. Go to Feedback Portal
2. Enter this in the message field: `<script>alert('XSS')</script>`
3. Submit the form
4. Flag will appear when XSS executes

### Module 2: SSRF (Medium)
1. Go to Digital Archive
2. Try fetching: `http://localhost:5001/admin`
3. Flag will appear when internal resource is accessed

### Module 3: Broken Authentication (Hard)
1. Go to System Diagnostics
2. Try weak credentials: `admin:123`
3. Or use SQL injection: `admin' OR '1'='1`
4. Or session token bypass with empty password
5. Flag will appear when authentication is bypassed

### Module 4: NoSQL Injection (Medium)
1. Go to Admin Portal
2. Switch to JSON mode
3. Use payload: `{"username": {"$ne": null}, "password": {"$ne": null}}`
4. Flag will appear when authentication is bypassed

## 🔧 Configuration

### Backend Configuration (.env)

Create `backend/.env`:
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cybersphere-labs

# Frontend
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=cybersphere_labs_jwt_secret_key_2024
JWT_EXPIRE=7d

# CTF Flags (Base64 encoded)
FLAG_MODULE_1=Q1lCRVJ7ZG9tX3hzc19mbGFnfQ==
FLAG_MODULE_2=Q1lCRVJ7c3NyZl9mbGFnfQ==
FLAG_MODULE_3=Q1lCRVJ7c3N0aV9mbGFnfQ==
FLAG_MODULE_4=Q1lCRVJ7bm9zcWxfaW5qZWN0aW9uX2ZsYWd9
```

### Frontend Configuration (.env)

Create `frontend/.env`:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 🛠️ Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check MongoDB status
mongosh --eval "db.stats()"

# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo service mongod start
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Option 1: Kill process
npx kill-port 5000

# Option 2: Change port in backend/.env
PORT=5001
```

### Issue: Modules Not Loading

**Solution:**
```bash
# Reinitialize database
cd backend
node init-db.js

# Clear browser cache and reload
```

### Issue: npm install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 🎮 Student Quick Reference

### Default Accounts
- **Demo User:** demo / demo123
- **Admin User:** admin / secret123

### Flag Format
All flags follow the format: `CYBER{vulnerability_flag}`

### Submission Process
1. Exploit vulnerability in lab environment
2. Copy the revealed flag
3. Go to module detail page
4. Submit flag for points

### Progress Tracking
- Dashboard shows completion status
- Leaderboard displays rankings
- Individual module progress tracked

## 👨‍🏫 Instructor Setup

### Creating New Users
```javascript
// In MongoDB shell or through API
db.users.insertOne({
  username: "student1",
  email: "student1@university.edu",
  password: "$2a$10$hashedpassword",
  role: "student"
});
```

### Monitoring Progress
```javascript
// Get all user progress
db.users.find({}, {
  username: 1,
  "progress.totalFlags": 1,
  "progress.completedModules": 1
});
```

### Resetting User Progress
```javascript
// Reset specific user
db.users.updateOne(
  { username: "student1" },
  { $set: { 
    "progress.totalFlags": 0,
    "progress.completedModules": []
  }}
);
```

## 🔒 Security Reminders

### For Educational Use Only
- ✅ Use in isolated lab environments
- ✅ Network segmentation recommended
- ❌ Never deploy to production
- ❌ Don't expose to public internet

### Best Practices
1. Run on dedicated lab machines
2. Regular security briefings for students
3. Clear usage policies
4. Monitor for misuse

## 📚 Additional Resources

### OWASP Learning
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

### Tools for Testing
- [Burp Suite Community](https://portswigger.net/burp/communitydownload)
- [OWASP ZAP](https://owasp.org/www-project-zap/)
- [Postman](https://www.postman.com/)

## 🚨 Emergency Procedures

### If System is Compromised
1. Immediately disconnect from network
2. Stop all services: `pkill -f node`
3. Review logs for suspicious activity
4. Restore from clean backup
5. Update security policies

### Reporting Issues
1. Document the vulnerability or issue
2. Include steps to reproduce
3. Note potential security implications
4. Contact system administrator

---

**Ready to hack? Start with the XSS module and work your way up! 🔒🎯**