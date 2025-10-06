# 🎯 CaptureZone - Cybersecurity CTF Platform

A comprehensive Capture The Flag (CTF) platform designed for cybersecurity education and training. CaptureZone provides hands-on experience with real-world web vulnerabilities in a safe, controlled environment.

![CaptureZone](https://img.shields.io/badge/CaptureZone-CTF%20Platform-brightgreen)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## 🌟 Features

- **4 Vulnerable Modules**: Each targeting different OWASP vulnerabilities
- **Real-time Flag Validation**: Instant feedback on successful exploits
- **Progress Tracking**: Monitor learning progress and achievements
- **Educational Documentation**: Comprehensive vulnerability explanations
- **Responsive Design**: Works on desktop and mobile devices
- **Cyberpunk Theme**: Engaging dark theme with neon accents

## 🎮 Available Modules

### 1. 🔥 Feedback Portal - DOM-based XSS
- **Difficulty**: Easy
- **Vulnerability**: Cross-Site Scripting (XSS)
- **Learning**: Client-side input validation bypass

### 2. 🌐 Digital Archive - SSRF
- **Difficulty**: Medium  
- **Vulnerability**: Server-Side Request Forgery
- **Learning**: Internal network access and enumeration

### 3. ⚡ System Diagnostics - Broken Authentication
- **Difficulty**: Hard
- **Vulnerability**: Authentication bypass techniques
- **Learning**: Weak passwords, session management flaws

### 4. 🔐 Admin Portal - NoSQL Injection
- **Difficulty**: Medium
- **Vulnerability**: NoSQL database injection
- **Learning**: MongoDB query manipulation

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Custom CSS** with cyberpunk styling

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for cloud database
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/capturezone.git
   cd capturezone
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend - copy and configure
   cp backend/.env.example backend/.env
   
   # Frontend - copy and configure
   cp frontend/.env.example frontend/.env
   ```

4. **Configure Environment Variables**
   
   **Backend (.env):**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   
   **Frontend (.env):**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the Application**
   ```bash
   # Start backend (in backend directory)
   npm start

   # Start frontend (in frontend directory)
   npm start
   ```

6. **Access the Platform**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Cloud Deployment (Recommended)

**Frontend (Netlify/Vercel):**
- Build command: `npm run build`
- Publish directory: `build`
- Root directory: `frontend`

**Backend (Render/Railway):**
- Build command: `npm install`
- Start command: `npm start`
- Root directory: `backend`

### Environment Variables for Production
Set these in your hosting platform:

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend:**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🛡️ Security Notes

⚠️ **Important**: This platform contains intentionally vulnerable code for educational purposes.

- **Never deploy to production** without removing vulnerabilities
- **Use only in controlled environments**
- **Educational purposes only**
- All vulnerabilities are clearly marked and documented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes. Please use responsibly.

---

**Happy Hacking! 🚀** Remember to always hack ethically and responsibly.